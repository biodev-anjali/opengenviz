"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import FRONTEND_URL, DEBUG
from api.v1.routes import router
from database.init_db import init_db

# Initialize database
init_db()

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


if __name__ == "__main__":
    import uvicorn
    from config import API_HOST, API_PORT
    uvicorn.run(app, host=API_HOST, port=API_PORT)

