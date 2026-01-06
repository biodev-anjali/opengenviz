"""Initialize database schema."""
from database.database import engine, Base
from database.models import AnalysisRecord, ComparisonRecord
from sqlalchemy import text


def init_db():
    """Create all database tables."""
    try:
        # Test connection first
        print("Testing database connection...")
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Database connection successful.")
        
        # Create tables
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        error_msg = str(e)
        # Tables/indexes may already exist, which is fine
        if "already exists" in error_msg.lower():
            print("Database already initialized.")
        elif "name or service not known" in error_msg.lower() or "errno -2" in error_msg.lower():
            print(f"ERROR: Cannot resolve database hostname. Check DATABASE_URL environment variable.")
            print(f"Error details: {error_msg}")
            raise
        else:
            print(f"Database initialization error: {error_msg}")
            raise


if __name__ == "__main__":
    init_db()

