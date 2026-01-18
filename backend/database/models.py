"""SQLAlchemy database models."""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index, Boolean
from sqlalchemy.sql import func
from database.database import Base


class AnalysisRecord(Base):
    """Model for storing sequence analysis results."""
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    sequence_hash = Column(String(64), unique=True, index=True, nullable=False)
    sequence_type = Column(String(20), nullable=False)  # DNA, RNA, Protein
    source_type = Column(String(20), nullable=False)  # upload, fetch
    source_identifier = Column(String(500), nullable=True)  # accession, gene name, URL
    original_fasta = Column(Text, nullable=False)
    sequence_length = Column(Integer, nullable=False)
    metadata_json = Column(Text, nullable=False)  # JSON string with counts, GC%, AT%, etc.
    visualization_data_json = Column(Text, nullable=False)  # JSON string with chart datasets
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Index for faster lookups
    __table_args__ = (
        Index('idx_sequence_hash', 'sequence_hash'),
        Index('idx_created_at', 'created_at'),
    )


class ComparisonRecord(Base):
    """Model for storing sequence comparison results."""
    __tablename__ = "comparison_records"

    id = Column(Integer, primary_key=True, index=True)
    reference_analysis_id = Column(Integer, ForeignKey("analysis_records.id"), nullable=False)
    sample_analysis_id = Column(Integer, ForeignKey("analysis_records.id"), nullable=False)
    alignment_data_json = Column(Text, nullable=False)  # JSON string with alignment result
    mutations_json = Column(Text, nullable=False)  # JSON string with mutation list
    mutation_count = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Indexes
    __table_args__ = (
        Index('idx_reference_analysis', 'reference_analysis_id'),
        Index('idx_sample_analysis', 'sample_analysis_id'),
        Index('idx_created_at', 'created_at'),
    )


class User(Base):
    """Model for user authentication and plan management."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    plan_type = Column(String(50), nullable=False, default='free')  # free, paid, enterprise
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Indexes
    __table_args__ = (
        Index('idx_email', 'email'),
        Index('idx_plan_type', 'plan_type'),
    )

