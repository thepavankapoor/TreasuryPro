#!/bin/bash

echo "================================================"
echo "TreasuryPro Financial Dashboard - Quick Start"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 detected"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

# Success message
echo ""
echo "================================================"
echo "✓ Installation complete!"
echo "================================================"
echo ""
echo "To start the dashboard:"
echo "1. Run: python app.py"
echo "2. Open your browser to: http://localhost:5000"
echo "3. Enter a stock ticker (e.g., AAPL) and click Analyze"
echo ""
echo "Note: Keep this terminal window open while using the dashboard"
echo "Press Ctrl+C to stop the server"
echo "================================================"
