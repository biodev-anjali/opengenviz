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
        try:
            with engine.begin() as conn:
                Base.metadata.create_all(bind=conn, checkfirst=True)
        except Exception as create_error:
            error_msg = str(create_error)
            # Only catch "already exists" errors for indexes/constraints
            if "already exists" in error_msg.lower() and ("index" in error_msg.lower() or "constraint" in error_msg.lower()):
                print(f"Note: Some indexes/constraints already exist: {error_msg}")
            else:
                print(f"Error during table creation: {error_msg}")
                import traceback
                print(f"Traceback: {traceback.format_exc()}")
                # Don't raise here - continue to verify
        
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
                try:
                    with engine.begin() as conn:
                        Base.metadata.create_all(bind=conn, checkfirst=False)
                except Exception as force_error:
                    print(f"Error during force creation: {force_error}")
                    import traceback
                    print(f"Traceback: {traceback.format_exc()}")
                # Verify again
                inspector = inspect(engine)
                tables_final = inspector.get_table_names()
                print(f"Tables after force creation: {tables_final}")
                if "analysis_records" in tables_final and "comparison_records" in tables_final:
                    print("Database tables created successfully (force).")
                else:
                    # Last resort: try creating with explicit SQL
                    print("Attempting explicit SQL table creation...")
                    try:
                        with engine.begin() as conn:
                            # Create analysis_records table
                            conn.execute(text("""
                                CREATE TABLE IF NOT EXISTS analysis_records (
                                    id SERIAL PRIMARY KEY,
                                    sequence_hash VARCHAR(64) UNIQUE NOT NULL,
                                    sequence_type VARCHAR(20) NOT NULL,
                                    source_type VARCHAR(20) NOT NULL,
                                    source_identifier VARCHAR(500),
                                    original_fasta TEXT NOT NULL,
                                    sequence_length INTEGER NOT NULL,
                                    metadata_json TEXT NOT NULL,
                                    visualization_data_json TEXT NOT NULL,
                                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                )
                            """))
                            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_sequence_hash ON analysis_records(sequence_hash)"))
                            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_created_at ON analysis_records(created_at)"))
                            
                            # Create comparison_records table
                            conn.execute(text("""
                                CREATE TABLE IF NOT EXISTS comparison_records (
                                    id SERIAL PRIMARY KEY,
                                    reference_analysis_id INTEGER NOT NULL REFERENCES analysis_records(id),
                                    sample_analysis_id INTEGER NOT NULL REFERENCES analysis_records(id),
                                    alignment_data_json TEXT NOT NULL,
                                    mutations_json TEXT NOT NULL,
                                    mutation_count INTEGER NOT NULL,
                                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                )
                            """))
                            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_reference_analysis ON comparison_records(reference_analysis_id)"))
                            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_sample_analysis ON comparison_records(sample_analysis_id)"))
                            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_created_at_comp ON comparison_records(created_at)"))
                        
                        # Verify final state
                        inspector = inspect(engine)
                        tables_sql = inspector.get_table_names()
                        print(f"Tables after SQL creation: {tables_sql}")
                        if "analysis_records" in tables_sql and "comparison_records" in tables_sql:
                            print("Database tables created successfully (SQL).")
                        else:
                            raise Exception(f"CRITICAL: Failed to create tables even with SQL. Found: {tables_sql}")
                    except Exception as sql_error:
                        print(f"Error during SQL table creation: {sql_error}")
                        import traceback
                        print(f"Traceback: {traceback.format_exc()}")
                        raise Exception(f"CRITICAL: All table creation methods failed. Last error: {sql_error}")
            
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

