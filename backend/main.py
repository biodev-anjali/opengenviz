"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import FRONTEND_URL, DEBUG
from api.v1.routes import router
from database.init_db import init_db

# Create FastAPI app
app = FastAPI(
    title="OpenGenViz API",
    description="Genomic Analysis Platform API for education and research purposes",
    version="1.0.0",
    debug=DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    import traceback
    try:
        init_db()
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR: Database initialization failed!")
        print(f"Error: {error_msg}")
        print(f"Traceback: {traceback.format_exc()}")
        print("\nTroubleshooting:")
        print("1. Check that DATABASE_URL is set in Render environment variables")
        print("2. Verify the PostgreSQL instance is running")
        print("3. Ensure the database hostname in DATABASE_URL is correct")
        print("4. Check that web service and database are in the same region (use Internal URL)")
        print("\nThe app will start, but database operations will fail until this is fixed.")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "OpenGenViz API",
        "version": "1.0.0",
        "status": "operational",
        "disclaimer": "This tool is for educational and research purposes only. It is not intended for clinical or diagnostic use."
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/health/db")
async def health_check_db():
    """Database health check endpoint."""
    from config import DATABASE_URL
    from database.database import engine
    from sqlalchemy import text
    
    try:
        # Mask password in URL for response
        from urllib.parse import urlparse, urlunparse
        parsed = urlparse(DATABASE_URL)
        if parsed.password:
            masked_url = urlunparse(parsed._replace(netloc=f"{parsed.username}:****@{parsed.hostname}:{parsed.port or 5432}"))
        else:
            masked_url = DATABASE_URL
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        
        return {
            "status": "healthy",
            "database": "connected",
            "url_masked": masked_url,
            "database_type": "postgresql" if "postgres" in DATABASE_URL.lower() else "sqlite"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "url_masked": masked_url if 'masked_url' in locals() else "unknown"
        }


if __name__ == "__main__":
    import uvicorn
    from config import API_HOST, API_PORT
    uvicorn.run(app, host=API_HOST, port=API_PORT)

