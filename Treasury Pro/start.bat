@echo off
echo ================================================
echo TreasuryPro Financial Dashboard - Quick Start
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo + Python detected

REM Create virtual environment
echo.
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo.
echo Installing dependencies...
pip install -r requirements.txt

REM Success message
echo.
echo ================================================
echo + Installation complete!
echo ================================================
echo.
echo To start the dashboard:
echo 1. Run: python app.py
echo 2. Open your browser to: http://localhost:5000
echo 3. Enter a stock ticker (e.g., AAPL) and click Analyze
echo.
echo Note: Keep this window open while using the dashboard
echo Press Ctrl+C to stop the server
echo ================================================
pause
