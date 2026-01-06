"""Initialize database schema."""
from database.database import engine, Base
from database.models import AnalysisRecord, ComparisonRecord


def init_db():
    """Create all database tables."""
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        # Tables/indexes may already exist, which is fine
        if "already exists" in str(e).lower():
            print("Database already initialized.")
        else:
            raise


if __name__ == "__main__":
    init_db()

