@echo off
REM Backend startup script for Windows
cd backend
python -m venv venv 2>nul
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
python -m database.init_db
python main.py

