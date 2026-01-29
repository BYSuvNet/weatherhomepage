// API Base URLs
const API_CONFIG = {
    statisticsApi: 'http://localhost:5080'
};

// Charts
let searchesChart = null;
let topCitiesChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    // Refresh every 30 seconds
    setInterval(loadStatistics, 30000);
});

// Load all statistics
async function loadStatistics() {
    try {
        const stats = await getStatistics();
        console.log('Statistics API svar:', stats);
        
        displayPopularCities(stats);
        updateChartsWithData(stats);
    } catch (error) {
        console.error('Kunde inte ladda statistik:', error);
        document.getElementById('popularCities').innerHTML = `
            <div class="error-stats">
                Kunde inte ladda statistik: ${error.message}
            </div>
        `;
    }
}

// Get statistics from API
async function getStatistics() {
    try {
        const url = `${API_CONFIG.statisticsApi}/api/stats/all`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API svarade med status ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Kunde inte ansluta till Statistics API på ' + API_CONFIG.statisticsApi);
        }
        throw error;
    }
}

// Display popular cities with bars
function displayPopularCities(stats) {
    const popularCitiesDiv = document.getElementById('popularCities');
    
    // Process data - stats is an array of {id, ipAddress, name, dateSearched}
    if (!Array.isArray(stats) || stats.length === 0) {
        popularCitiesDiv.innerHTML = '<p>Ingen statistik tillgänglig än. Sök efter städer för att se statistik!</p>';
        return;
    }
    
    // Count occurrences of each city
    const cityCount = {};
    stats.forEach(item => {
        const cityName = item.name || item.Name;
        if (cityName) {
            cityCount[cityName] = (cityCount[cityName] || 0) + 1;
        }
    });
    
    // Convert to array and sort
    const cityData = Object.entries(cityCount).map(([name, count]) => ({
        name,
        count
    })).sort((a, b) => b.count - a.count);
    
    // Take top 10
    const top10 = cityData.slice(0, 10);
    
    const maxCount = Math.max(...top10.map(c => c.count));
    const totalSearches = stats.length;
    
    // Create stats cards
    const statsCardsHtml = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Totalt antal sökningar</h3>
                <p class="stat-value">${totalSearches}</p>
            </div>
            <div class="stat-card">
                <h3>Unika städer</h3>
                <p class="stat-value">${cityData.length}</p>
            </div>
            <div class="stat-card">
                <h3>Populäraste staden</h3>
                <p class="stat-value">${top10[0].name}</p>
            </div>
            <div class="stat-card">
                <h3>Antal sökningar (populärast)</h3>
                <p class="stat-value">${top10[0].count}</p>
            </div>
        </div>
    `;
    
    // Create bar chart
    const barsHtml = top10.map((city, index) => {
        const percentage = (city.count / maxCount) * 100;
        return `
            <div class="city-bar">
                <span class="city-rank">#${index + 1}</span>
                <span class="city-name">${city.name}</span>
                <div class="city-bar-visual" style="width: ${percentage}%"></div>
                <span class="city-count">${city.count} sökningar</span>
            </div>
        `;
    }).join('');
    
    popularCitiesDiv.innerHTML = statsCardsHtml + '<div class="city-bar-chart">' + barsHtml + '</div>';
}

// Update charts with data
function updateChartsWithData(stats) {
    // Process data - stats is an array of {id, ipAddress, name, dateSearched}
    if (!Array.isArray(stats) || stats.length === 0) {
        return;
    }
    
    // Count occurrences of each city
    const cityCount = {};
    stats.forEach(item => {
        const cityName = item.name || item.Name;
        if (cityName) {
            cityCount[cityName] = (cityCount[cityName] || 0) + 1;
        }
    });
    
    // Convert to array and sort
    const cityData = Object.entries(cityCount).map(([name, count]) => ({
        name,
        count
    })).sort((a, b) => b.count - a.count);
    
    const top10 = cityData.slice(0, 10);
    
    // Top Cities Chart (Horizontal Bar)
    const ctx1 = document.getElementById('topCitiesChart');
    if (topCitiesChart) {
        topCitiesChart.destroy();
    }
    
    topCitiesChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: top10.map(c => c.name),
            datasets: [{
                label: 'Antal sökningar',
                data: top10.map(c => c.count),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(199, 199, 199, 0.8)',
                    'rgba(83, 102, 255, 0.8)',
                    'rgba(255, 99, 255, 0.8)',
                    'rgba(99, 255, 132, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(255, 99, 255, 1)',
                    'rgba(99, 255, 132, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'De 10 mest sökta städerna',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Searches over time (group by date)
    const searchesByDate = {};
    stats.forEach(item => {
        const date = new Date(item.dateSearched);
        const dateKey = date.toLocaleDateString('sv-SE');
        searchesByDate[dateKey] = (searchesByDate[dateKey] || 0) + 1;
    });
    
    const dateData = Object.entries(searchesByDate)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .slice(-14); // Last 14 days
    
    const ctx2 = document.getElementById('searchesChart');
    if (searchesChart) {
        searchesChart.destroy();
    }
    
    searchesChart = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: dateData.map(d => d[0]),
            datasets: [{
                label: 'Sökningar per dag',
                data: dateData.map(d => d[1]),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Sökningar över tid (senaste 14 dagarna)',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}
