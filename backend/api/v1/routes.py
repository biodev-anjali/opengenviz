"""API route handlers."""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
import json

from database.database import get_db
from services.fetch_service import fetch_sequence
from services.analysis_service import analyze_sequence
from services.comparison_service import compare_sequences
from services.history_service import (
    store_analysis,
    get_analysis,
    list_analyses,
    store_comparison
)
from utils.sequence_utils import parse_fasta, validate_fasta
from api.v1.schemas import (
    SequenceFetchRequest,
    ComparisonRequest,
    AnalysisResponse,
    ComparisonResponse,
    HistoryResponse,
    HistoryDetailResponse,
    ErrorResponse
)

router = APIRouter(prefix="/api/v1", tags=["v1"])


@router.post("/upload", response_model=AnalysisResponse)
async def upload_sequence(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and analyze FASTA file."""
    try:
        # Read file content
        content = await file.read()
        fasta_content = content.decode('utf-8')
        
        # Validate FASTA
        is_valid, error_msg = validate_fasta(fasta_content)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg or "Invalid FASTA format")
        
        # Parse FASTA
        header, sequence = parse_fasta(fasta_content)
        
        # Analyze sequence
        analysis_result = analyze_sequence(sequence)
        
        # Store in history
        analysis_id = store_analysis(
            db=db,
            sequence=sequence,
            sequence_type=analysis_result["sequence_type"],
            source_type="upload",
            source_identifier=header or file.filename,
            original_fasta=fasta_content,
            analysis_result=analysis_result
        )
        
        return AnalysisResponse(
            analysis_id=analysis_id,
            sequence_type=analysis_result["sequence_type"],
            length=analysis_result["length"],
            counts=analysis_result["counts"],
            gc_percent=analysis_result.get("gc_percent"),
            at_percent=analysis_result.get("at_percent"),
            visualization_data=analysis_result["visualization_data"],
            source_type="upload",
            source_identifier=header or file.filename
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing upload: {str(e)}")


@router.post("/fetch-sequence", response_model=AnalysisResponse)
async def fetch_and_analyze_sequence(
    request: SequenceFetchRequest,
    db: Session = Depends(get_db)
):
    """Fetch sequence from public database and analyze."""
    try:
        # Fetch sequence
        fasta_content, source_identifier, error = fetch_sequence(
            source_type=request.source_type,
            accession=request.accession,
            gene_name=request.gene_name,
            species=request.species,
            url=request.url
        )
        
        if error:
            raise HTTPException(status_code=400, detail=error)
        
        if not fasta_content:
            raise HTTPException(status_code=404, detail="Sequence not found")
        
        # Validate FASTA
        is_valid, error_msg = validate_fasta(fasta_content)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg or "Invalid FASTA format")
        
        # Parse FASTA
        header, sequence = parse_fasta(fasta_content)
        
        # Analyze sequence
        analysis_result = analyze_sequence(sequence)
        
        # Store in history
        analysis_id = store_analysis(
            db=db,
            sequence=sequence,
            sequence_type=analysis_result["sequence_type"],
            source_type="fetch",
            source_identifier=source_identifier or header,
            original_fasta=fasta_content,
            analysis_result=analysis_result
        )
        
        return AnalysisResponse(
            analysis_id=analysis_id,
            sequence_type=analysis_result["sequence_type"],
            length=analysis_result["length"],
            counts=analysis_result["counts"],
            gc_percent=analysis_result.get("gc_percent"),
            at_percent=analysis_result.get("at_percent"),
            visualization_data=analysis_result["visualization_data"],
            source_type="fetch",
            source_identifier=source_identifier or header
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sequence: {str(e)}")


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_sequence_endpoint(
    request: dict,
    db: Session = Depends(get_db)
):
    """Analyze sequence from FASTA content string."""
    try:
        fasta_content = request.get("fasta_content", "")
        if not fasta_content:
            raise HTTPException(status_code=400, detail="FASTA content is required")
        
        # Validate FASTA
        is_valid, error_msg = validate_fasta(fasta_content)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg or "Invalid FASTA format")
        
        # Parse FASTA
        header, sequence = parse_fasta(fasta_content)
        
        # Analyze sequence
        analysis_result = analyze_sequence(sequence)
        
        # Store in history
        analysis_id = store_analysis(
            db=db,
            sequence=sequence,
            sequence_type=analysis_result["sequence_type"],
            source_type="upload",
            source_identifier=header,
            original_fasta=fasta_content,
            analysis_result=analysis_result
        )
        
        return AnalysisResponse(
            analysis_id=analysis_id,
            sequence_type=analysis_result["sequence_type"],
            length=analysis_result["length"],
            counts=analysis_result["counts"],
            gc_percent=analysis_result.get("gc_percent"),
            at_percent=analysis_result.get("at_percent"),
            visualization_data=analysis_result["visualization_data"],
            source_type="upload",
            source_identifier=header
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing sequence: {str(e)}")


@router.post("/compare", response_model=ComparisonResponse)
async def compare_sequences_endpoint(
    request: ComparisonRequest,
    db: Session = Depends(get_db)
):
    """Compare two sequences and detect mutations."""
    try:
        # Get reference and sample analyses
        ref_analysis = get_analysis(db, request.reference_id)
        sample_analysis = get_analysis(db, request.sample_id)
        
        if not ref_analysis:
            raise HTTPException(status_code=404, detail=f"Reference analysis {request.reference_id} not found")
        
        if not sample_analysis:
            raise HTTPException(status_code=404, detail=f"Sample analysis {request.sample_id} not found")
        
        # Extract sequences from FASTA
        ref_header, ref_sequence = parse_fasta(ref_analysis["original_fasta"])
        sample_header, sample_sequence = parse_fasta(sample_analysis["original_fasta"])
        
        # Compare sequences
        comparison_result = compare_sequences(ref_sequence, sample_sequence)
        
        # Store comparison
        comparison_id = store_comparison(
            db=db,
            reference_analysis_id=request.reference_id,
            sample_analysis_id=request.sample_id,
            alignment_data=comparison_result["alignment"],
            mutations=comparison_result["mutations"]
        )
        
        return ComparisonResponse(
            comparison_id=comparison_id,
            reference_analysis_id=request.reference_id,
            sample_analysis_id=request.sample_id,
            alignment=comparison_result["alignment"],
            mutations=comparison_result["mutations"],
            mutation_count=comparison_result["mutation_count"],
            substitution_count=comparison_result["substitution_count"],
            insertion_count=comparison_result["insertion_count"],
            deletion_count=comparison_result["deletion_count"],
            mutation_heatmap=comparison_result["mutation_heatmap"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing sequences: {str(e)}")


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get paginated list of analysis history."""
    try:
        result = list_analyses(db, skip=skip, limit=limit)
        return HistoryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")


@router.get("/history/{analysis_id}", response_model=HistoryDetailResponse)
async def get_history_detail(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """Get full analysis record by ID."""
    try:
        analysis = get_analysis(db, analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail=f"Analysis {analysis_id} not found")
        
        return HistoryDetailResponse(**analysis)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving analysis: {str(e)}")

