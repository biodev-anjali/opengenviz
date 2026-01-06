"""Initialize database schema."""
from database.database import engine, Base
from database.models import AnalysisRecord, ComparisonRecord


def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")


if __name__ == "__main__":
    init_db()

