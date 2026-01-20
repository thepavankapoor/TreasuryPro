# TreasuryPro Financial Dashboard

A comprehensive financial dashboard that provides real-time stock analysis with key financial ratios and metrics.

## Features

### Key Financial Ratios Displayed:

1. **Sharpe Ratio** - Risk-adjusted return measurement
2. **P/E Ratio** - Price-to-Earnings ratio for valuation
3. **Debt/Equity Ratio** - Leverage measurement
4. **Earnings Per Share (EPS)** - Profitability per share
5. **Liquidity Ratios**:
   - Current Ratio
   - Quick Ratio
   - Working Capital
6. **Return on Equity (ROE)** - Profitability metric
7. **Profit Margin Ratios**:
   - Gross Profit Margin
   - Operating Profit Margin
   - Net Profit Margin
8. **Turnover Ratios**:
   - Asset Turnover
   - Inventory Turnover
   - Receivables Turnover

### Additional Features:

- Real-time stock price data
- Market capitalization and trading volume
- 52-week high/low prices
- Beta and dividend yield
- Financial statements (Revenue, Net Income, Free Cash Flow)
- Health score indicators (Profitability, Liquidity, Efficiency, Leverage)
- Beautiful, responsive UI with dark theme
- Animated charts and meters

## Installation

### Prerequisites:
- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## Usage

1. Open your web browser and navigate to `http://localhost:5000`
2. Enter a stock ticker symbol (e.g., AAPL, MSFT, GOOGL, TSLA)
3. Click "Analyze" or press Enter
4. View comprehensive financial analysis with all key ratios

## Technology Stack

- **Backend**: Python with Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Data Source**: Anthropic API with web search for real-time financial data
- **Styling**: Custom CSS with gradient effects and animations

## Key Ratio Calculations

### Sharpe Ratio
```
Sharpe Ratio = (Average Return - Risk-Free Rate) / Standard Deviation of Returns
```

### Liquidity Ratios
```
Current Ratio = Current Assets / Current Liabilities
Quick Ratio = (Current Assets - Inventory) / Current Liabilities
```

### Profitability Ratios
```
Gross Margin = (Revenue - COGS) / Revenue × 100
Operating Margin = Operating Income / Revenue × 100
Net Margin = Net Income / Revenue × 100
ROE = Net Income / Shareholders' Equity × 100
```

### Efficiency Ratios
```
Asset Turnover = Revenue / Total Assets
Inventory Turnover = COGS / Average Inventory
Receivables Turnover = Revenue / Average Accounts Receivable
```

### Leverage Ratios
```
Debt-to-Equity = Total Debt / Shareholders' Equity
```

## Health Score Metrics

The dashboard calculates four health scores (0-100):

1. **Profitability Score**: Based on net margin and ROE
2. **Liquidity Score**: Based on current and quick ratios
3. **Efficiency Score**: Based on turnover ratios
4. **Leverage Score**: Based on debt-to-equity (lower is better)

## API Endpoints

- `GET /` - Main dashboard page
- `GET /api/stock/<ticker>` - Fetch financial data for a stock ticker
- `GET /api/health` - Health check endpoint

## File Structure

```
financial-dashboard/
│
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── README.md             # This file
│
├── templates/
│   └── index.html        # Main dashboard HTML
│
└── static/
    ├── style.css         # Dashboard styling
    └── script.js         # Frontend JavaScript
```

## Customization

### Changing Colors
Edit `static/style.css` and modify the CSS variables in the `:root` section:

```css
:root {
    --primary: #10b981;      /* Primary color */
    --secondary: #14b8a6;    /* Secondary color */
    --accent: #3b82f6;       /* Accent color */
    /* ... */
}
```

### Adding More Ratios
1. Update the API prompt in `app.py` to fetch additional data
2. Add new ratio display elements in `templates/index.html`
3. Update the JavaScript in `static/script.js` to populate the new elements

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, modify the last line in `app.py`:

```python
app.run(debug=True, port=5001)  # Change to any available port
```

### API Rate Limiting
The Anthropic API has rate limits. If you encounter rate limiting errors, wait a few seconds between requests.

### Data Not Loading
- Check your internet connection
- Verify the stock ticker is valid (US stocks only)
- Check browser console for JavaScript errors

## License

This project is for educational and informational purposes only. Financial data should not be used as the sole basis for investment decisions.

## Disclaimer

This dashboard provides financial information for informational purposes only. Always consult with a qualified financial advisor before making investment decisions. Past performance does not guarantee future results.
