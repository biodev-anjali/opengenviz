"""Configuration management for the application."""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).parent

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'genomic_analysis.db'}"
)

# API configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# Frontend configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# NCBI E-utilities configuration
NCBI_EMAIL = os.getenv("NCBI_EMAIL", "your-email@example.com")
NCBI_API_KEY = os.getenv("NCBI_API_KEY", "")  # Optional but recommended

# Application settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB default

