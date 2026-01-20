// DOM Elements
const form = document.getElementById('searchForm');
const tickerInput = document.getElementById('tickerInput');
const searchButton = document.getElementById('searchButton');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const errorMsg = document.getElementById('errorMsg');
const loading = document.getElementById('loading');
const mainContent = document.getElementById('mainContent');

// Store current data
let currentData = null;

// Event Listeners
form.addEventListener('submit', handleSearch);

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

// Ratio category dropdown
document.addEventListener('DOMContentLoaded', () => {
    const ratioCategory = document.getElementById('ratioCategory');
    if (ratioCategory) {
        ratioCategory.addEventListener('change', (e) => {
            if (currentData) {
                displayRatios(currentData, e.target.value);
            }
        });
    }
    
    // Load default ticker
    tickerInput.value = 'AAPL';
    fetchStockData('AAPL');
});

// Handle search
async function handleSearch(e) {
    e.preventDefault();
    const ticker = tickerInput.value.trim().toUpperCase();
    
    if (!ticker) {
        showError('Please enter a stock ticker');
        return;
    }
    
    await fetchStockData(ticker);
}

// Store current ticker for downloads
let currentTicker = '';

// Fetch stock data
async function fetchStockData(ticker) {
    try {
        showLoading(true);
        hideError();
        mainContent.classList.add('hidden');
        
        // Store ticker globally for downloads
        currentTicker = ticker.toUpperCase();
        
        const response = await fetch(`/api/stock/${ticker}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch stock data');
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        currentData = data;
        updateDashboard(data);
        
        showLoading(false);
        mainContent.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to fetch data. Please try again.');
        showLoading(false);
    }
}

// Update dashboard with data
function updateDashboard(data) {
    // Company header
    document.getElementById('companyName').textContent = data.companyName || data.symbol;
    document.getElementById('companyInfo').textContent = `${data.sector} | ${data.industry}`;
    document.getElementById('price').textContent = formatCurrency(data.price);
    
    const changeEl = document.getElementById('change');
    const changeText = `${data.change >= 0 ? '+' : ''}${formatNumber(data.change, 2)} (${data.changePercent >= 0 ? '+' : ''}${formatNumber(data.changePercent, 2)}%)`;
    changeEl.textContent = changeText;
    changeEl.className = `change ${data.changePercent >= 0 ? 'positive' : 'negative'}`;
    
    // Overview tab
    document.getElementById('marketCap').textContent = formatLargeNumber(data.marketCap);
    document.getElementById('peRatio').textContent = formatNumber(data.peRatio, 2);
    document.getElementById('eps').textContent = formatCurrency(data.eps);
    document.getElementById('beta').textContent = formatNumber(data.beta, 2);
    document.getElementById('dividendYield').textContent = formatPercent(data.dividendYield);
    document.getElementById('high52').textContent = formatCurrency(data.high52);
    document.getElementById('low52').textContent = formatCurrency(data.low52);
    document.getElementById('volume').textContent = formatVolume(data.volume);
    document.getElementById('avgVolume').textContent = formatVolume(data.avgVolume);
    document.getElementById('sharpeRatio').textContent = formatNumber(data.sharpeRatio, 2);
    
    // Display initial ratios
    displayRatios(data, 'valuation');
    
    // Display trends
    displayTrends(data.trends);
    
    // Display peer comparison
    displayPeerComparison(data.peerComparison);
    
    // Display red flags
    displayRedFlags(data.redFlags);
    
    // Display industry info
    document.getElementById('sector').textContent = data.sector;
    document.getElementById('industryName').textContent = data.industry;
    displayIndustryAnalysis(data);
    
    // Display events and transcripts
    displayEvents(data.events);
    displayTranscriptLinks(data.transcriptLinks);
    
    // Display news in overview
    displayNews(data.news);
    
    // Display interest rates
    displayInterestRates(data.interestRates);
}

// Display news with proper formatting
function displayNews(news) {
    const element = document.getElementById('latestNews');
    
    if (!news || news.length === 0) {
        element.innerHTML = `
            <p style="color: #7f8c8d; padding: 20px;">No recent news available. Visit financial news sites for latest updates.</p>
            <div style="margin-top: 15px; padding: 0 20px;">
                <a href="https://finance.yahoo.com" target="_blank" class="btn-link" style="display: inline-block; margin-right: 10px; padding: 10px 20px; font-size: 14px;">Yahoo Finance</a>
                <a href="https://www.bloomberg.com" target="_blank" class="btn-link" style="display: inline-block; padding: 10px 20px; font-size: 14px;">Bloomberg</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="news-feed-items">';
    
    news.forEach((item, index) => {
        // Format the timestamp
        let timeAgo = 'Recently';
        if (item.time && item.time > 0) {
            const now = Math.floor(Date.now() / 1000);
            const diffSeconds = now - item.time;
            const diffHours = Math.floor(diffSeconds / 3600);
            const diffDays = Math.floor(diffSeconds / 86400);
            const diffWeeks = Math.floor(diffSeconds / 604800);
            
            if (diffWeeks > 0) {
                timeAgo = `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
            } else if (diffDays > 0) {
                timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            } else if (diffHours > 0) {
                timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else {
                timeAgo = 'Recently';
            }
        }
        
        // Clean up title
        const title = item.title || `Financial News Update ${index + 1}`;
        const publisher = item.publisher || 'Financial News';
        const link = item.link || 'https://finance.yahoo.com';
        
        // Generate placeholder with company initials or icon
        const firstLetter = title.charAt(0).toUpperCase();
        
        html += `
            <div class="news-item-large" onclick="window.open('${link}', '_blank')">
                <div class="news-thumbnail">
                    <div class="news-thumbnail-placeholder">${firstLetter}</div>
                </div>
                <div class="news-details">
                    <h4 class="news-headline-large">
                        <a href="${link}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${title}</a>
                    </h4>
                    <div class="news-metadata-large">
                        <span class="news-source-large">${publisher}</span>
                        <span class="news-separator-large">•</span>
                        <span class="news-time-large">${timeAgo}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    element.innerHTML = html;
    
    // Add tab functionality
    const tabs = document.querySelectorAll('.news-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter logic can be added here if needed
            const filter = this.dataset.filter;
            console.log('Filter news by:', filter);
        });
    });
}

// Display interest rates tables
function displayInterestRates(ratesData) {
    if (!ratesData) {
        console.log('No rates data available');
        return;
    }
    
    console.log('Displaying rates data:', ratesData);
    
    // Display Treasury bills table
    const treasuryTableEl = document.getElementById('treasuryTable');
    if (treasuryTableEl && ratesData.treasuryYields && ratesData.treasuryYields.length > 0) {
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Maturity</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600;">Yield</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600;">Change</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        ratesData.treasuryYields.forEach(bill => {
            const changeColor = bill.change && bill.change.startsWith('+') ? '#27ae60' : bill.change && bill.change.startsWith('-') ? '#e74c3c' : '#7f8c8d';
            html += `
                <tr style="border-bottom: 1px solid #ecf0f1;">
                    <td style="padding: 12px;">${bill.maturity}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600;">${bill.yield}</td>
                    <td style="padding: 12px; text-align: right; color: ${changeColor}; font-weight: 600;">${bill.change || '-'}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        treasuryTableEl.innerHTML = html;
    }
    
    // Display Central Bank rates table
    const cbRatesTableEl = document.getElementById('centralBankRatesTable');
    if (cbRatesTableEl && ratesData.centralBankRates && ratesData.centralBankRates.length > 0) {
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Country</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Central Bank</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600;">Policy Rate</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600;">Last Change</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        ratesData.centralBankRates.forEach(rate => {
            html += `
                <tr style="border-bottom: 1px solid #ecf0f1;">
                    <td style="padding: 12px; font-weight: 600;">${rate.country}</td>
                    <td style="padding: 12px; color: #7f8c8d;">${rate.bank}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600; color: #3498db;">${rate.rate}</td>
                    <td style="padding: 12px; text-align: right; color: #7f8c8d;">${rate.lastChange}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        cbRatesTableEl.innerHTML = html;
    }
    
    // Display Inflation rates table
    const inflationTableEl = document.getElementById('inflationRatesTable');
    if (inflationTableEl && ratesData.inflationRates && ratesData.inflationRates.length > 0) {
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Country</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600;">CPI Inflation Rate</th>
                        <th style="padding: 12px; text-align: right; font-weight: 600;">Last Update</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        ratesData.inflationRates.forEach(inflation => {
            // Parse rate to determine color (higher inflation = red, lower = green)
            const rateValue = parseFloat(inflation.rate);
            const rateColor = rateValue >= 3.0 ? '#e74c3c' : rateValue >= 2.0 ? '#f39c12' : '#27ae60';
            
            html += `
                <tr style="border-bottom: 1px solid #ecf0f1;">
                    <td style="padding: 12px; font-weight: 600;">${inflation.country}</td>
                    <td style="padding: 12px; text-align: right; font-weight: 600; color: ${rateColor};">${inflation.rate}</td>
                    <td style="padding: 12px; text-align: right; color: #7f8c8d;">${inflation.lastUpdate}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        inflationTableEl.innerHTML = html;
    }
}

// Display ratios based on category with indicators
function displayRatios(data, category) {
    const content = document.getElementById('ratioContent');
    let html = '<table class="data-table">';
    
    switch(category) {
        case 'valuation':
            html += `
                <tr><td>P/E Ratio<span class="ratio-indicator">(Lower generally better)</span></td><td>${formatNumber(data.peRatio, 2)}</td></tr>
                <tr><td>EPS (Earnings Per Share)<span class="ratio-indicator">(Higher better)</span></td><td>${formatCurrency(data.eps)}</td></tr>
                <tr><td>Market Cap<span class="ratio-indicator">(Informational)</span></td><td>${formatLargeNumber(data.marketCap)}</td></tr>
            `;
            break;
        case 'profitability':
            html += `
                <tr><td>Gross Profit Margin<span class="ratio-indicator">(Higher better)</span></td><td>${formatPercent(data.grossMargin)}</td></tr>
                <tr><td>Operating Profit Margin<span class="ratio-indicator">(Higher better)</span></td><td>${formatPercent(data.operatingMargin)}</td></tr>
                <tr><td>Net Profit Margin<span class="ratio-indicator">(Higher better)</span></td><td>${formatPercent(data.netMargin)}</td></tr>
                <tr><td>Return on Equity (ROE)<span class="ratio-indicator">(Higher better)</span></td><td>${formatPercent(data.roe)}</td></tr>
            `;
            break;
        case 'liquidity':
            html += `
                <tr><td>Current Ratio<span class="ratio-indicator">(Higher better, >1 ideal)</span></td><td>${formatNumber(data.currentRatio, 2)}</td></tr>
                <tr><td>Quick Ratio<span class="ratio-indicator">(Higher better, >1 ideal)</span></td><td>${formatNumber(data.quickRatio, 2)}</td></tr>
                <tr><td>Working Capital<span class="ratio-indicator">(Higher better)</span></td><td>${formatLargeNumber((data.currentRatio - 1) * data.totalLiabilities)}</td></tr>
            `;
            break;
        case 'leverage':
            html += `
                <tr><td>Debt-to-Equity Ratio<span class="ratio-indicator">(Lower better, <1 ideal)</span></td><td>${formatNumber(data.debtToEquity, 2)}</td></tr>
                <tr><td>Total Debt<span class="ratio-indicator">(Lower better)</span></td><td>${formatLargeNumber(data.debtToEquity * data.shareholdersEquity)}</td></tr>
                <tr><td>Shareholders Equity<span class="ratio-indicator">(Higher better)</span></td><td>${formatLargeNumber(data.shareholdersEquity)}</td></tr>
            `;
            break;
        case 'efficiency':
            html += `
                <tr><td>Asset Turnover<span class="ratio-indicator">(Higher better)</span></td><td>${formatNumber(data.assetTurnover, 2)}</td></tr>
                <tr><td>Inventory Turnover<span class="ratio-indicator">(Higher better)</span></td><td>${formatNumber(data.inventoryTurnover, 2)}</td></tr>
                <tr><td>Receivables Turnover<span class="ratio-indicator">(Higher better)</span></td><td>${formatNumber(data.receivablesTurnover, 2)}</td></tr>
            `;
            break;
    }
    
    html += '</table>';
    content.innerHTML = html;
}

// Display trends
function displayTrends(trends) {
    displayTrendData('fcfTrend', trends.freeCashFlow, 'Free Cash Flow');
    displayTrendData('peTrend', trends.peRatio, 'P/E Ratio');
    displayTrendData('debtTrend', trends.debt, 'Debt');
    displayTrendData('revenueTrend', trends.revenue, 'Revenue');
}

function displayTrendData(elementId, data, label) {
    const element = document.getElementById(elementId);
    
    if (!data || data.length === 0) {
        element.innerHTML = '<p style="color: #7f8c8d; padding: 15px;">No trend data available for this metric. This may be due to limited historical financial data.</p>';
        return;
    }
    
    // Calculate trend direction
    const values = data.map(d => d.value);
    const isIncreasing = values[0] < values[values.length - 1];
    const changePercent = values[0] !== 0 ? ((values[values.length - 1] - values[0]) / Math.abs(values[0])) * 100 : 0;
    
    let html = '';
    
    // Show last 8 data points
    const recentData = data.slice(Math.max(0, data.length - 8));
    recentData.forEach(item => {
        html += `
            <div class="trend-item">
                <span>${item.date}</span>
                <span style="font-weight: 600;">${label === 'P/E Ratio' ? formatNumber(item.value, 2) : formatLargeNumber(item.value)}</span>
            </div>
        `;
    });
    
    html += `
        <div class="trend-summary">
            <strong>Trend:</strong> 
            <span class="${isIncreasing ? 'trend-up' : 'trend-down'}">
                ${isIncreasing ? '↑' : '↓'} ${isIncreasing ? 'Increasing' : 'Decreasing'} 
                (${changePercent >= 0 ? '+' : ''}${formatNumber(changePercent, 1)}% over period)
            </span>
        </div>
    `;
    
    element.innerHTML = html;
}

// Display peer comparison
function displayPeerComparison(peerData) {
    const element = document.getElementById('peerTable');
    
    if (!peerData || !peerData.peers || peerData.peers.length === 0) {
        element.innerHTML = '<p style="color: #7f8c8d;">No peer data available</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Company</th>
                    <th>P/E Ratio</th>
                    <th>Current Ratio</th>
                    <th>Market Cap</th>
                    <th>Debt-to-Equity</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    peerData.peers.forEach((peer, index) => {
        html += `
            <tr class="${index === 0 ? 'highlight' : ''}">
                <td><strong>${peer.symbol}</strong><br><small>${peer.name}</small></td>
                <td>${formatNumber(peer.peRatio, 2)}</td>
                <td>${formatNumber(peer.currentRatio, 2)}</td>
                <td>${formatLargeNumber(peer.marketCap)}</td>
                <td>${formatNumber(peer.debtToEquity, 2)}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    element.innerHTML = html;
}

// Display red flags
function displayRedFlags(redFlags) {
    const element = document.getElementById('redFlagsList');
    
    if (!redFlags || redFlags.length === 0) {
        element.innerHTML = `
            <div class="no-flags">
                <div class="no-flags-icon">✓</div>
                <h3>No Major Red Flags Detected</h3>
                <p>The company's financials appear to be in good health based on current analysis.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    redFlags.forEach(flag => {
        html += `
            <div class="red-flag-item ${flag.severity}">
                <div class="red-flag-header">
                    <strong>${flag.category}</strong>
                    <span class="severity-badge ${flag.severity}">${flag.severity}</span>
                </div>
                <p>${flag.message}</p>
            </div>
        `;
    });
    
    element.innerHTML = html;
}

// Display industry analysis
function displayIndustryAnalysis(data) {
    const element = document.getElementById('industryTrends');
    
    // Calculate average peer metrics
    if (data.peerComparison && data.peerComparison.peers && data.peerComparison.peers.length > 1) {
        const peers = data.peerComparison.peers.slice(1); // Exclude current company
        
        const avgPE = peers.reduce((sum, p) => sum + p.peRatio, 0) / peers.length;
        const avgCurrentRatio = peers.reduce((sum, p) => sum + p.currentRatio, 0) / peers.length;
        
        element.innerHTML = `
            <p><strong>Industry Averages (based on peers):</strong></p>
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li>Average P/E Ratio: ${formatNumber(avgPE, 2)} (Company: ${formatNumber(data.peRatio, 2)})</li>
                <li>Average Current Ratio: ${formatNumber(avgCurrentRatio, 2)} (Company: ${formatNumber(data.currentRatio, 2)})</li>
            </ul>
            <p style="margin-top: 15px;">
                ${data.peRatio > avgPE ? 'Company trades at a premium to peers.' : 'Company trades at a discount to peers.'}
                ${data.currentRatio > avgCurrentRatio ? 'Liquidity position is stronger than peer average.' : 'Liquidity position is weaker than peer average.'}
            </p>
        `;
    } else {
        element.innerHTML = '<p>Industry peer comparison data not available.</p>';
    }
}

// Display transcript links
function displayTranscriptLinks(links) {
    if (links) {
        document.getElementById('transcriptSeekingAlpha').href = links.seekingAlpha || '#';
        document.getElementById('transcriptFool').href = links.fool || '#';
        document.getElementById('transcriptYahoo').href = links.yahoo || '#';
    }
}

// Display events
function displayEvents(events) {
    const element = document.getElementById('eventsList');
    
    if (!events || events.length === 0) {
        element.innerHTML = '<p style="color: #7f8c8d;">No upcoming events currently scheduled. Check back for updates on earnings calls, AGM, and investor presentations.</p>';
        return;
    }
    
    let html = '';
    events.forEach(event => {
        html += `
            <div class="event-item">
                <div class="event-type">${event.type}</div>
                <div class="event-date">${event.date}</div>
                <p>${event.description}</p>
            </div>
        `;
    });
    
    element.innerHTML = html;
}

// Switch tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Formatting functions
function formatCurrency(value) {
    if (value === null || value === undefined || value === 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined) return '0.00';
    return parseFloat(value).toFixed(decimals);
}

function formatPercent(value) {
    if (value === null || value === undefined) return '0.00%';
    return `${parseFloat(value).toFixed(2)}%`;
}

function formatLargeNumber(value) {
    if (value === null || value === undefined || value === 0) return '$0.00B';
    
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= 1e12) {
        return `${sign}$${(absValue / 1e12).toFixed(2)}T`;
    } else if (absValue >= 1e9) {
        return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
        return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
    } else if (absValue >= 1e3) {
        return `${sign}$${(absValue / 1e3).toFixed(2)}K`;
    } else {
        return `${sign}$${absValue.toFixed(2)}`;
    }
}

function formatVolume(value) {
    if (value === null || value === undefined || value === 0) return '0';
    
    if (value >= 1e9) {
        return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(2)}K`;
    } else {
        return value.toFixed(0);
    }
}

// UI Helper functions
function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
        btnText.style.display = 'none';
        btnLoader.classList.remove('hidden');
        searchButton.disabled = true;
    } else {
        loading.classList.add('hidden');
        btnText.style.display = 'inline';
        btnLoader.classList.add('hidden');
        searchButton.disabled = false;
    }
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

function hideError() {
    errorMsg.classList.add('hidden');
}

// Year selection helper functions
function selectAllYears() {
    document.querySelectorAll('.year-checkbox').forEach(cb => cb.checked = true);
}

function selectRecentYears() {
    document.querySelectorAll('.year-checkbox').forEach(cb => {
        const year = parseInt(cb.value);
        cb.checked = year >= 2020; // Last 5 years (2020-2024)
    });
}

function clearYears() {
    document.querySelectorAll('.year-checkbox').forEach(cb => cb.checked = false);
}

// Download financial statements
function downloadFinancials() {
    if (!currentTicker) {
        alert('Please search for a company first');
        return;
    }
    
    const statementType = document.getElementById('statementType').value;
    const format = document.getElementById('fileFormat').value;
    
    // Get selected years
    const selectedYears = [];
    document.querySelectorAll('.year-checkbox:checked').forEach(cb => {
        selectedYears.push(cb.value);
    });
    
    if (selectedYears.length === 0) {
        alert('Please select at least one year');
        return;
    }
    
    // Build URL with selected years as comma-separated string
    const yearsParam = selectedYears.join(',');
    const url = `/download/financials/${currentTicker}?type=${statementType}&years=${yearsParam}&format=${format}`;
    
    // Trigger download
    window.location.href = url;
}

// Download interest rates data
function downloadRates(format) {
    const url = `/download/rates?format=${format}`;
    window.location.href = url;
}
