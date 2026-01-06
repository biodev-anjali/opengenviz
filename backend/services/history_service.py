"""History and reproducibility service."""
import json
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from database.models import AnalysisRecord, ComparisonRecord
from utils.sequence_utils import compute_sequence_hash


def store_analysis(
    db: Session,
    sequence: str,
    sequence_type: str,
    source_type: str,
    source_identifier: Optional[str],
    original_fasta: str,
    analysis_result: Dict[str, Any]
) -> int:
    """
    Store analysis result in database with deduplication.
    
    Args:
        db: Database session
        sequence: Cleaned sequence string
        sequence_type: DNA, RNA, or Protein
        source_type: upload or fetch
        source_identifier: Accession, gene name, or URL
        original_fasta: Original FASTA content
        analysis_result: Analysis results dictionary
        
    Returns:
        Analysis record ID (existing or new)
    """
    # Compute hash for deduplication
    sequence_hash = compute_sequence_hash(sequence)
    
    # Check for existing record
    existing = db.query(AnalysisRecord).filter(
        AnalysisRecord.sequence_hash == sequence_hash
    ).first()
    
    if existing:
        return existing.id
    
    # Create new record
    record = AnalysisRecord(
        sequence_hash=sequence_hash,
        sequence_type=sequence_type,
        source_type=source_type,
        source_identifier=source_identifier,
        original_fasta=original_fasta,
        sequence_length=analysis_result["length"],
        metadata_json=json.dumps({
            "counts": analysis_result.get("counts", {}),
            "gc_percent": analysis_result.get("gc_percent"),
            "at_percent": analysis_result.get("at_percent"),
        }),
        visualization_data_json=json.dumps(analysis_result.get("visualization_data", {}))
    )
    
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return record.id


def get_analysis(db: Session, analysis_id: int) -> Optional[Dict[str, Any]]:
    """
    Retrieve full analysis record by ID.
    
    Args:
        db: Database session
        analysis_id: Analysis record ID
        
    Returns:
        Dictionary with full analysis data or None
    """
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == analysis_id).first()
    
    if not record:
        return None
    
    return {
        "id": record.id,
        "sequence_type": record.sequence_type,
        "source_type": record.source_type,
        "source_identifier": record.source_identifier,
        "original_fasta": record.original_fasta,
        "sequence_length": record.sequence_length,
        "metadata": json.loads(record.metadata_json),
        "visualization_data": json.loads(record.visualization_data_json),
        "created_at": record.created_at.isoformat() if record.created_at else None
    }


def list_analyses(db: Session, skip: int = 0, limit: int = 100) -> Dict[str, Any]:
    """
    List all analyses with pagination.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        
    Returns:
        Dictionary with analyses list and total count
    """
    total = db.query(AnalysisRecord).count()
    records = db.query(AnalysisRecord).order_by(
        AnalysisRecord.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    analyses = []
    for record in records:
        metadata = json.loads(record.metadata_json)
        analyses.append({
            "id": record.id,
            "sequence_type": record.sequence_type,
            "source_type": record.source_type,
            "source_identifier": record.source_identifier,
            "sequence_length": record.sequence_length,
            "gc_percent": metadata.get("gc_percent"),
            "at_percent": metadata.get("at_percent"),
            "created_at": record.created_at.isoformat() if record.created_at else None
        })
    
    return {
        "analyses": analyses,
        "total": total,
        "skip": skip,
        "limit": limit
    }


def store_comparison(
    db: Session,
    reference_analysis_id: int,
    sample_analysis_id: int,
    alignment_data: Dict[str, Any],
    mutations: List[Dict[str, Any]]
) -> int:
    """
    Store sequence comparison result.
    
    Args:
        db: Database session
        reference_analysis_id: Reference analysis record ID
        sample_analysis_id: Sample analysis record ID
        alignment_data: Alignment result dictionary
        mutations: List of mutation dictionaries
        
    Returns:
        Comparison record ID
    """
    record = ComparisonRecord(
        reference_analysis_id=reference_analysis_id,
        sample_analysis_id=sample_analysis_id,
        alignment_data_json=json.dumps(alignment_data),
        mutations_json=json.dumps(mutations),
        mutation_count=len(mutations)
    )
    
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return record.id


def get_comparison(db: Session, comparison_id: int) -> Optional[Dict[str, Any]]:
    """
    Retrieve comparison record by ID.
    
    Args:
        db: Database session
        comparison_id: Comparison record ID
        
    Returns:
        Dictionary with comparison data or None
    """
    record = db.query(ComparisonRecord).filter(
        ComparisonRecord.id == comparison_id
    ).first()
    
    if not record:
        return None
    
    return {
        "id": record.id,
        "reference_analysis_id": record.reference_analysis_id,
        "sample_analysis_id": record.sample_analysis_id,
        "alignment_data": json.loads(record.alignment_data_json),
        "mutations": json.loads(record.mutations_json),
        "mutation_count": record.mutation_count,
        "created_at": record.created_at.isoformat() if record.created_at else None
    }

