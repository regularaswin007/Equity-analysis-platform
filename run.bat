@echo off
cd /d "%~dp0"
if exist C:\pl set PYTHONPATH=C:\pl
start http://localhost:8000
python -m uvicorn app.main:app --port 8000
pause
