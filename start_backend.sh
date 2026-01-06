#!/bin/bash
# Backend startup script
cd backend
python -m venv venv 2>/dev/null || true
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
pip install -r requirements.txt --quiet
python -m database.init_db
python main.py

