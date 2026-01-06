"""Pydantic schemas for API requests and responses."""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


# Request schemas
class SequenceFetchRequest(BaseModel):
    """Request schema for fetching sequence."""
    source_type: str = Field(..., description="Source type: ncbi_accession, ncbi_gene, embl, or url")
    accession: Optional[str] = Field(None, description="Accession number")
    gene_name: Optional[str] = Field(None, description="Gene name")
    species: Optional[str] = Field(None, description="Species name")
    url: Optional[str] = Field(None, description="Direct URL to FASTA file")


class ComparisonRequest(BaseModel):
    """Request schema for sequence comparison."""
    reference_id: int = Field(..., description="Reference analysis record ID")
    sample_id: int = Field(..., description="Sample analysis record ID")


# Response schemas
class AnalysisResponse(BaseModel):
    """Response schema for sequence analysis."""
    analysis_id: int
    sequence_type: str
    length: int
    counts: Dict[str, int]
    gc_percent: Optional[float]
    at_percent: Optional[float]
    visualization_data: Dict[str, Any]
    source_type: str
    source_identifier: Optional[str]


class ComparisonResponse(BaseModel):
    """Response schema for sequence comparison."""
    comparison_id: int
    reference_analysis_id: int
    sample_analysis_id: int
    alignment: Dict[str, Any]
    mutations: List[Dict[str, Any]]
    mutation_count: int
    substitution_count: int
    insertion_count: int
    deletion_count: int
    mutation_heatmap: Dict[str, Any]


class HistoryItem(BaseModel):
    """Schema for history list item."""
    id: int
    sequence_type: str
    source_type: str
    source_identifier: Optional[str]
    sequence_length: int
    gc_percent: Optional[float]
    at_percent: Optional[float]
    created_at: str


class HistoryResponse(BaseModel):
    """Response schema for history list."""
    analyses: List[HistoryItem]
    total: int
    skip: int
    limit: int


class HistoryDetailResponse(BaseModel):
    """Response schema for history detail."""
    id: int
    sequence_type: str
    source_type: str
    source_identifier: Optional[str]
    original_fasta: str
    sequence_length: int
    metadata: Dict[str, Any]
    visualization_data: Dict[str, Any]
    created_at: str


class ErrorResponse(BaseModel):
    """Error response schema."""
    error: str
    detail: Optional[str] = None

