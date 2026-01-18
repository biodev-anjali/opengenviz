"""Authentication utilities for user management."""
import hashlib
import secrets
from typing import Optional
from datetime import datetime, timedelta
import jwt

# TODO: Move to environment variables or config
SECRET_KEY = "opengenviz-secret-key-change-in-production"  # Should be in config.py
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days


def hash_password(password: str) -> str:
    """
    Hash password using SHA256 (simple hashing for MVP scaffolding).
    
    Note: For production, use bcrypt or argon2 instead of SHA256.
    This is a minimal scaffold for future implementation.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against hash.
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password
        
    Returns:
        True if password matches, False otherwise
    """
    return hash_password(plain_password) == hashed_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token.
    
    Args:
        data: Dictionary containing token payload (e.g., {"sub": user_email})
        expires_delta: Optional expiration time delta
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify JWT access token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_plan_features(plan_type: str) -> dict:
    """
    Get feature set for a given plan type.
    
    This function structures code so future paid plans can be added easily.
    Currently returns same features for all plans (free tier).
    
    Args:
        plan_type: Plan type (free, paid, enterprise)
        
    Returns:
        Dictionary with feature flags
    """
    # Base features for all plans
    base_features = {
        "sequence_analysis": True,
        "visualization": True,
        "export_png": True,
        "export_pdf": True,
        "history_access": True,
    }
    
    # Plan-specific features (scaffold for future implementation)
    if plan_type == "free":
        return {
            **base_features,
            "max_analyses_per_month": 100,
            "max_file_size_mb": 10,
        }
    elif plan_type == "paid":
        return {
            **base_features,
            "max_analyses_per_month": 1000,
            "max_file_size_mb": 100,
            "priority_support": True,
        }
    elif plan_type == "enterprise":
        return {
            **base_features,
            "max_analyses_per_month": -1,  # Unlimited
            "max_file_size_mb": 500,
            "priority_support": True,
            "api_access": True,
            "custom_integrations": True,
        }
    else:
        # Default to free plan
        return {
            **base_features,
            "max_analyses_per_month": 100,
            "max_file_size_mb": 10,
        }

