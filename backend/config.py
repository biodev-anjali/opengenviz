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

# Log database URL (without password) for debugging
if DATABASE_URL and "postgres" in DATABASE_URL.lower():
    # Mask password in URL for logging
    try:
        from urllib.parse import urlparse, urlunparse
        parsed = urlparse(DATABASE_URL)
        if parsed.password:
            masked_url = urlunparse(parsed._replace(netloc=f"{parsed.username}:****@{parsed.hostname}:{parsed.port or 5432}"))
            print(f"Database URL configured: {masked_url}")
        else:
            print(f"Database URL configured: {parsed.scheme}://{parsed.hostname}:{parsed.port or 5432}{parsed.path}")
    except Exception:
        print(f"Database URL configured (masked)")
elif "sqlite" in DATABASE_URL.lower():
    print(f"Using SQLite database: {DATABASE_URL}")
else:
    print(f"Database URL type: {DATABASE_URL.split('://')[0] if '://' in DATABASE_URL else 'unknown'}")

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

