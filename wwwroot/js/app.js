// API Base URLs - Konfigurera dessa baserat på dina API-portar
const API_CONFIG = {
    weatherApi: 'http://localhost:5266',
    catApi: 'http://localhost:5219',
    quoteApi: 'http://localhost:5212',
    statisticsApi: 'http://localhost:5159',
    adsApi: 'http://localhost:5112',
    warningsApi: 'http://localhost:5000',
    spaceApi: 'http://localhost:5136'
};

// Map variables
let map = null;
let marker = null;
let cityMarkers = [];
let loadedCities = new Set();

// Major cities with coordinates
const majorCities = [
    { name: 'Stockholm', lat: 59.3293, lon: 18.0686 },
    { name: 'Göteborg', lat: 57.7089, lon: 11.9746 },
    { name: 'Malmö', lat: 55.6050, lon: 13.0038 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
    { name: 'Rome', lat: 41.9028, lon: 12.4964 },
    { name: 'Oslo', lat: 59.9139, lon: 10.7522 },
    { name: 'Copenhagen', lat: 55.6761, lon: 12.5683 },
    { name: 'Helsinki', lat: 60.1699, lon: 24.9384 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
    { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
    { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
    { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    { name: 'Seoul', lat: 37.5665, lon: 126.9780 },
    { name: 'Bangkok', lat: 13.7563, lon: 100.5018 }
];

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
        // sendStatistics(city);

        // Load cat image
        // loadCatImage();

        // Get weather data
        const weatherData = await getWeather(city);
        displayWeather(weatherData);
        
        // Load warnings
        //loadWarnings(city, weatherData.date);
        
        // Load ad based on location
        // if (weatherData.longitude && weatherData.latitude) {
        //     loadAd(weatherData.longitude, weatherData.latitude);
        // }
        
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
            <div id="map" style="height: 400px; width: 100%; border-radius: 8px;"></div>
        </div>
    `;
    
    // Initialize or update map
    updateMap(data.latitude, data.longitude, cityInput.value, data);
}

// Initialize or update map with location
function updateMap(lat, lon, cityName, weatherData) {
    // Wait for DOM to be ready
    setTimeout(() => {
        const mapElement = document.getElementById('map');
        
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }
        
        // Remove existing map if any
        if (map) {
            map.remove();
        }
        
        // Create new map
        map = L.map('map').setView([lat, lon], 10);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Create popup content with weather info
        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0;">${cityName}</h3>
                <p style="margin: 5px 0;"><strong>📅 Datum:</strong> ${weatherData.date}</p>
                <p style="margin: 5px 0;"><strong>🌡️ Temperatur:</strong> ${weatherData.tempC}°C</p>
                <p style="margin: 5px 0;"><strong>☁️ Väder:</strong> ${weatherData.description}</p>
                <p style="margin: 5px 0;"><strong>💨 Vind:</strong> ${weatherData.windSpeedMS} m/s</p>
                <p style="margin: 5px 0; font-size: 0.9em; color: #666;">📍 ${lat}°N, ${lon}°E</p>
            </div>
        `;
        
        // Add marker with weather info popup
        marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(popupContent, { maxWidth: 300 }).openPopup();
        
        // Check for cities in view when map stops moving
        map.on('moveend', () => {
            checkCitiesInView();
        });
        
        // Initial check for cities in view
        checkCitiesInView();
    }, 100);
}

// Check which major cities are in the current map view
function checkCitiesInView() {
    if (!map) return;
    
    const bounds = map.getBounds();
    const citiesInView = majorCities.filter(city => {
        return bounds.contains([city.lat, city.lon]) && !loadedCities.has(city.name);
    });
    
    // Load weather for cities in view (limit to prevent too many API calls)
    citiesInView.slice(0, 5).forEach(city => {
        loadCityWeather(city);
    });
}

// Load weather for a specific city and add marker
async function loadCityWeather(city) {
    // Mark as loaded to prevent duplicate requests
    loadedCities.add(city.name);
    
    try {
        const today = new Date().toISOString().split('T')[0];
        const url = `${API_CONFIG.weatherApi}/api/weather?city=${encodeURIComponent(city.name)}&date=${today}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.log(`Weather not available for ${city.name}`);
            return;
        }
        
        const weatherData = await response.json();
        
        // Create popup content
        const popupContent = `
            <div style="min-width: 180px;">
                <h4 style="margin: 0 0 8px 0;">${city.name}</h4>
                <p style="margin: 4px 0;"><strong>🌡️</strong> ${weatherData.tempC}°C</p>
                <p style="margin: 4px 0;"><strong>☁️</strong> ${weatherData.description}</p>
                <p style="margin: 4px 0;"><strong>💨</strong> ${weatherData.windSpeedMS} m/s</p>
            </div>
        `;
        
        // Create marker with smaller blue icon for cities
        const cityIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        
        const cityMarker = L.marker([city.lat, city.lon], { icon: cityIcon }).addTo(map);
        cityMarker.bindPopup(popupContent);
        cityMarkers.push(cityMarker);
        
    } catch (error) {
        console.log(`Could not load weather for ${city.name}:`, error.message);
    }
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
