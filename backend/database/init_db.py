"""Initialize database schema."""
from database.database import engine, Base
from database.models import AnalysisRecord, ComparisonRecord
from sqlalchemy import text, inspect


def init_db():
    """Create all database tables."""
    try:
        # Test connection first
        print("Testing database connection...")
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Database connection successful.")
        
        # Check if tables exist
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        print(f"Existing tables: {existing_tables}")
        
        # Create tables if they don't exist
        print("Creating database tables...")
        # Use begin() to ensure transaction is committed
        with engine.begin() as conn:
            Base.metadata.create_all(bind=conn, checkfirst=True)
        
        # Verify tables were created
        inspector = inspect(engine)
        tables_after = inspector.get_table_names()
        print(f"Tables after creation: {tables_after}")
        
        if "analysis_records" in tables_after and "comparison_records" in tables_after:
            print("Database tables created successfully.")
        else:
            print("WARNING: Some tables may not have been created.")
            print(f"Expected: analysis_records, comparison_records")
            print(f"Found: {tables_after}")
            # Force create if missing
            if "analysis_records" not in tables_after or "comparison_records" not in tables_after:
                print("Attempting to force create missing tables...")
                with engine.begin() as conn:
                    Base.metadata.create_all(bind=conn, checkfirst=False)
                # Verify again
                inspector = inspect(engine)
                tables_final = inspector.get_table_names()
                print(f"Tables after force creation: {tables_final}")
            
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
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            raise


if __name__ == "__main__":
    init_db()

