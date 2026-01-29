// API Base URLs - Konfigurera dessa baserat på dina API-portar
const API_CONFIG = {
    weatherApi: 'http://10.27.1.180:5266',
    catApi: 'http://10.27.3.180:5219',
    quoteApi: 'http://localhost:5212',
    statisticsApi: 'http://10.27.0.204:5159',
    adsApi: 'http://10.27.1.14:5112',
    warningsApi: 'http://10.27.6.112:5000',
    spaceApi: 'http://localhost:5136'
};

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherResult = document.getElementById('weatherResult');
const warningResult = document.getElementById('warningResult');
const catImage = document.getElementById('catImage');
const headerCatImage = document.getElementById('headerCatImage');
const weatherQuote = document.getElementById('weatherQuote');
const sponsorAd = document.getElementById('sponsorAd');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadQuote();
    loadHeaderCatImage();
    loadAd(18.0686, 12.3293); // Stockholm/Sverige koordinater som default
    
    searchButton.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});

// Handle search
async function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError(weatherResult, 'Vänligen ange en stad');
        return;
    }
    
    weatherResult.innerHTML = '<p>Söker väderinformation...</p>';
    warningResult.innerHTML = '';
    catImage.innerHTML = '';
    sponsorAd.innerHTML = '';
    
    try {
        // Send statistics
        sendStatistics(city);

        // Load cat image
        loadCatImage();

        // Get weather data
        const weatherData = await getWeather(city);
        displayWeather(weatherData);
        
        // Load warnings
        //loadWarnings(city, weatherData.date);
        
        // Load ad based on location
        if (weatherData.longitude && weatherData.latitude) {
            loadAd(weatherData.longitude, weatherData.latitude);
        }
        
    } catch (error) {
        showError(weatherResult, error.message);
    }
}

// Get weather data
async function getWeather(city) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const url = `${API_CONFIG.weatherApi}/api/weather?city=${encodeURIComponent(city)}&date=${today}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Kunde inte hämta väderdata för ${city}. Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Weather API svar:', data);
        
        // Validate data structure
        if (!data.tempC || !data.description) {
            throw new Error('Väder-API:et returnerade ofullständig data');
        }
        
        return data;
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Kunde inte ansluta till väder-API:et. Kontrollera att servern körs på ' + API_CONFIG.weatherApi);
        }
        throw error;
    }
}

// Display weather data
function displayWeather(data) {
    weatherResult.innerHTML = `
        <div class="weather-info">
            <h3>Väder för ${cityInput.value}</h3>
            <p><strong>Datum:</strong> ${data.date}</p>
            <p><strong>Temperatur:</strong> ${data.tempC}°C</p>
            <p><strong>Beskrivning:</strong> ${data.description}</p>
            <p><strong>Vindhastighet:</strong> ${data.windSpeedMS} m/s</p>
            <p><strong>Position:</strong> ${data.latitude}°N, ${data.longitude}°E</p>
        </div>
    `;
}

// Load random cat image
async function loadCatImage() {
    try {
        const url = `${API_CONFIG.catApi}/api/cats`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Kunde inte hämta kattbild');
        }
        
        const data = await response.json();
        console.log('Cat API svar (main):', data);
        
        if (!data.url) {
            throw new Error('Katt-API:et returnerade ofullständig data');
        }
        
        catImage.innerHTML = `
            <div class="cat-section">
                <h3>Random Katt-bild</h3>
                <img src="${data.url}" alt="${data.Description || 'Kattbild'}" style="max-width: 100%; height: auto;">
                <p>${data.Description || ''}</p>
            </div>
        `;
    } catch (error) {
        showError(catImage, `Kunde inte ladda kattbild: ${error.message}. Kontrollera att Cat API körs på ${API_CONFIG.catApi}`);
    }
}

// Load random cat image for header
async function loadHeaderCatImage() {
    try {
        const url = `${API_CONFIG.catApi}/api/cats`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Kunde inte hämta kattbild');
        }
        
        const data = await response.json();
        console.log('Cat API svar (header):', data);
        
        if (!data.url) {
            throw new Error('Katt-API:et returnerade ofullständig data');
        }
        
        headerCatImage.innerHTML = `<img src="${data.url}" alt="${data.Description || 'Kattbild'}" class="header-cat">`;
    } catch (error) {
        console.warn('Kunde inte ladda header-kattbild:', error.message);
    }
}

// Load random quote
async function loadQuote() {
    try {
        const url = `${API_CONFIG.quoteApi}/api/quote`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Kunde inte hämta citat');
        }
        
        const data = await response.json();
        console.log('Quote API svar:', data);
        
        if (!data.text) {
            throw new Error('Quote-API:et returnerade ofullständig data');
        }
        
        weatherQuote.innerHTML = `<em>"${data.text}"</em>`;
    } catch (error) {
        weatherQuote.innerHTML = `<em>Kunde inte ladda citat: ${error.message}. Kontrollera att Quote API körs på ${API_CONFIG.quoteApi}</em>`;
    }
}

// Send statistics
async function sendStatistics(city) {
    try {
        const url = `${API_CONFIG.statisticsApi}/api/stats`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name: city })
        });
        
        if (!response.ok) {
            console.warn('Not response OK: Kunde inte skicka statistik:', response.status);
        } else {
            const data = await response.json();
            console.log('Statistics API svar:', data);
        }
    } catch (error) {
        console.warn('Kunde inte skicka statistik:', error.message);
    }
}

// Load ad based on location
async function loadAd(lon, lat) {
    try {
        const url = `${API_CONFIG.adsApi}/api/ad/${lon}/${lat}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Kunde inte hämta annons');
        }
        
        const data = await response.json();
        console.log('Ads API svar:', data);
        
        if (!data.title || !data.description) {
            throw new Error('Ads-API:et returnerade ofullständig data');
        }
        
        // Fix relative image URL
        const imageUrl = `${API_CONFIG.adsApi}${data.imgUrl}`// ? (data.imageUrl.startsWith('http') ? data.imgUrl : `${API_CONFIG.adsApi}${data.imgUrl.startsWith('/') ? '' : '/'}${data.imgUrl}`) : null;
        
        sponsorAd.innerHTML = `
            <div class="ad-content">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                ${imageUrl ? `<img src="${imageUrl}" alt="${data.title}" style="max-width: 100%; height: auto;">` : ''}
                ${data.linkUrl ? `<a href="${data.linkUrl}" target="_blank">Läs mer</a>` : ''}
            </div>
        `;
    } catch (error) {
        showError(sponsorAd, `Kunde inte ladda annons: ${error.message}. Kontrollera att Ads API körs på ${API_CONFIG.adsApi}`);
    }
}

// Show error message
function showError(element, message) {
    element.innerHTML = `<div class="error-message">${message}</div>`;
}
