"""Database connection and session management."""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URL
import os

# Create database engine with connection pooling for PostgreSQL
if "postgres" in DATABASE_URL.lower() or "postgresql" in DATABASE_URL.lower():
    # PostgreSQL connection with pool settings
    # Note: connect_args for PostgreSQL - no immediate connection attempt
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verify connections before using
        pool_recycle=300,    # Recycle connections after 5 minutes
        connect_args={
            "connect_timeout": 10,  # 10 second timeout
        },
        # Don't connect on engine creation
        poolclass=None,
    )
else:
    # SQLite connection
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

