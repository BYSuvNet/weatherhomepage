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

// Top 100 cities in Sweden with coordinates
const majorCities = [
    { name: 'Stockholm', lat: 59.3293, lon: 18.0686 },
    { name: 'Göteborg', lat: 57.7089, lon: 11.9746 },
    { name: 'Malmö', lat: 55.6050, lon: 13.0038 },
    { name: 'Uppsala', lat: 59.8586, lon: 17.6389 },
    { name: 'Västerås', lat: 59.6099, lon: 16.5448 },
    { name: 'Örebro', lat: 59.2753, lon: 15.2134 },
    { name: 'Linköping', lat: 58.4108, lon: 15.6214 },
    { name: 'Helsingborg', lat: 56.0465, lon: 12.6945 },
    { name: 'Jönköping', lat: 57.7826, lon: 14.1618 },
    { name: 'Norrköping', lat: 58.5877, lon: 16.1924 },
    { name: 'Lund', lat: 55.7047, lon: 13.1910 },
    { name: 'Umeå', lat: 63.8258, lon: 20.2630 },
    { name: 'Gävle', lat: 60.6749, lon: 17.1413 },
    { name: 'Borås', lat: 57.7210, lon: 12.9401 },
    { name: 'Eskilstuna', lat: 59.3717, lon: 16.5077 },
    { name: 'Södertälje', lat: 59.1955, lon: 17.6253 },
    { name: 'Karlstad', lat: 59.3793, lon: 13.5036 },
    { name: 'Täby', lat: 59.4439, lon: 18.0687 },
    { name: 'Växjö', lat: 56.8777, lon: 14.8091 },
    { name: 'Halmstad', lat: 56.6745, lon: 12.8577 },
    { name: 'Sundsvall', lat: 62.3908, lon: 17.3069 },
    { name: 'Luleå', lat: 65.5848, lon: 22.1547 },
    { name: 'Trollhättan', lat: 58.2837, lon: 12.2886 },
    { name: 'Östersund', lat: 63.1792, lon: 14.6357 },
    { name: 'Borlänge', lat: 60.4858, lon: 15.4362 },
    { name: 'Falun', lat: 60.6066, lon: 15.6263 },
    { name: 'Kalmar', lat: 56.6634, lon: 16.3567 },
    { name: 'Kristianstad', lat: 56.0294, lon: 14.1567 },
    { name: 'Skellefteå', lat: 64.7507, lon: 20.9503 },
    { name: 'Karlskrona', lat: 56.1612, lon: 15.5869 },
    { name: 'Uddevalla', lat: 58.3478, lon: 11.9424 },
    { name: 'Skövde', lat: 58.3911, lon: 13.8454 },
    { name: 'Varberg', lat: 57.1057, lon: 12.2502 },
    { name: 'Lidingö', lat: 59.3667, lon: 18.1333 },
    { name: 'Märsta', lat: 59.6176, lon: 17.8541 },
    { name: 'Motala', lat: 58.5370, lon: 15.0364 },
    { name: 'Landskrona', lat: 55.8708, lon: 12.8301 },
    { name: 'Örnsköldsvik', lat: 63.2909, lon: 18.7153 },
    { name: 'Nyköping', lat: 58.7533, lon: 17.0084 },
    { name: 'Karlskoga', lat: 59.3265, lon: 14.5235 },
    { name: 'Åkersberga', lat: 59.4797, lon: 18.3039 },
    { name: 'Vallentuna', lat: 59.5342, lon: 18.0777 },
    { name: 'Trelleborg', lat: 55.3753, lon: 13.1567 },
    { name: 'Lidköping', lat: 58.5053, lon: 13.1577 },
    { name: 'Katrineholm', lat: 59.0000, lon: 16.2000 },
    { name: 'Ängelholm', lat: 56.2428, lon: 12.8622 },
    { name: 'Sandviken', lat: 60.6167, lon: 16.7667 },
    { name: 'Kungsbacka', lat: 57.4867, lon: 12.0744 },
    { name: 'Kiruna', lat: 67.8558, lon: 20.2253 },
    { name: 'Köping', lat: 59.5145, lon: 15.9911 },
    { name: 'Hässleholm', lat: 56.1589, lon: 13.7661 },
    { name: 'Sollentuna', lat: 59.4281, lon: 17.9508 },
    { name: 'Ystad', lat: 55.4297, lon: 13.8200 },
    { name: 'Södertälje', lat: 59.1955, lon: 17.6253 },
    { name: 'Haninge', lat: 59.1647, lon: 18.1444 },
    { name: 'Nässjö', lat: 57.6531, lon: 14.6967 },
    { name: 'Boden', lat: 65.8250, lon: 21.6886 },
    { name: 'Kumla', lat: 59.1294, lon: 15.1414 },
    { name: 'Lerum', lat: 57.7703, lon: 12.2694 },
    { name: 'Vetlanda', lat: 57.4289, lon: 15.0778 },
    { name: 'Falkenberg', lat: 56.9054, lon: 12.4914 },
    { name: 'Alingsås', lat: 57.9306, lon: 12.5336 },
    { name: 'Enköping', lat: 59.6356, lon: 17.0778 },
    { name: 'Huskvarna', lat: 57.7856, lon: 14.3000 },
    { name: 'Mjölby', lat: 58.3253, lon: 15.1275 },
    { name: 'Tumba', lat: 59.1989, lon: 17.8333 },
    { name: 'Åstorp', lat: 56.1342, lon: 12.9456 },
    { name: 'Vänersborg', lat: 58.3808, lon: 12.3236 },
    { name: 'Kungälv', lat: 57.8703, lon: 11.9800 },
    { name: 'Strängnäs', lat: 59.3775, lon: 17.0336 },
    { name: 'Säffle', lat: 59.1333, lon: 12.9333 },
    { name: 'Arvika', lat: 59.6558, lon: 12.5903 },
    { name: 'Piteå', lat: 65.3167, lon: 21.4833 },
    { name: 'Tranås', lat: 58.0372, lon: 14.9786 },
    { name: 'Stenungsund', lat: 58.0706, lon: 11.8189 },
    { name: 'Oskarshamn', lat: 57.2644, lon: 16.4486 },
    { name: 'Nybro', lat: 56.7433, lon: 15.9058 },
    { name: 'Nykvarn', lat: 59.1731, lon: 17.4372 },
    { name: 'Finspång', lat: 58.7069, lon: 15.7689 },
    { name: 'Oxelösund', lat: 58.6706, lon: 17.0964 },
    { name: 'Höganäs', lat: 56.1989, lon: 12.5522 },
    { name: 'Eslöv', lat: 55.8392, lon: 13.3042 },
    { name: 'Ludvika', lat: 60.1497, lon: 15.1878 },
    { name: 'Kristinehamn', lat: 59.3097, lon: 14.1081 },
    { name: 'Skara', lat: 58.3856, lon: 13.4381 },
    { name: 'Laholm', lat: 56.5111, lon: 13.0456 },
    { name: 'Mariestad', lat: 58.7094, lon: 13.8236 },
    { name: 'Sölvesborg', lat: 56.0511, lon: 14.5886 },
    { name: 'Vaxholm', lat: 59.4019, lon: 18.3536 },
    { name: 'Åmål', lat: 59.0511, lon: 12.7042 },
    { name: 'Kinna', lat: 57.5069, lon: 12.6950 },
    { name: 'Mora', lat: 61.0086, lon: 14.5397 },
    { name: 'Simrishamn', lat: 55.5556, lon: 14.3528 },
    { name: 'Boo', lat: 59.3333, lon: 18.2667 },
    { name: 'Lomma', lat: 55.6719, lon: 13.0772 },
    { name: 'Olofström', lat: 56.2808, lon: 14.5397 },
    { name: 'Ängelholm', lat: 56.2428, lon: 12.8622 }
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
        
        // Load warnings
        const warning = await loadWarnings(city, weatherData.date);
        
        // Display weather with warning
        displayWeather(weatherData, warning);
        
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
function displayWeather(data, warning = null) {
    weatherResult.innerHTML = `
        <div class="weather-info">
            <div id="map" style="height: 400px; width: 100%; border-radius: 8px;"></div>
        </div>
    `;
    
    // Initialize or update map
    updateMap(data.latitude, data.longitude, cityInput.value, data, warning);
}

// Initialize or update map with location
function updateMap(lat, lon, cityName, weatherData, warning = null) {
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
        let popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0;">${cityName}</h3>
                <p style="margin: 5px 0;"><strong>📅 Datum:</strong> ${weatherData.date}</p>
                <p style="margin: 5px 0;"><strong>🌡️ Temperatur:</strong> ${weatherData.tempC}°C</p>
                <p style="margin: 5px 0;"><strong>☁️ Väder:</strong> ${weatherData.description}</p>
                <p style="margin: 5px 0;"><strong>💨 Vind:</strong> ${weatherData.windSpeedMS} m/s</p>
                <p style="margin: 5px 0; font-size: 0.9em; color: #666;">📍 ${lat}°N, ${lon}°E</p>`;
        
        if (warning && warning.level > 0) {
            popupContent += `
                <div style="margin-top: 10px; padding: 8px; background: #fff3cd; border-left: 3px solid #ff6b6b; border-radius: 4px;">
                    <strong style="color: #d63031;">⚠️ Varning (Nivå ${warning.level})</strong>
                    <p style="margin: 5px 0; white-space: pre-line; font-size: 0.9em;">${warning.details}</p>
                </div>`;
        }
        
        popupContent += `</div>`;
        
        // Get marker icon based on warning level
        const markerIcon = getWarningIcon(warning ? warning.level : 0);
        
        // Add marker with weather info popup
        marker = L.marker([lat, lon], { icon: markerIcon }).addTo(map);
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
        
        // Get warning for this city
        const warning = await loadWarnings(city.name, today);
        
        // Create popup content
        let popupContent = `
            <div style="min-width: 180px;">
                <h4 style="margin: 0 0 8px 0;">${city.name}</h4>
                <p style="margin: 4px 0;"><strong>🌡️</strong> ${weatherData.tempC}°C</p>
                <p style="margin: 4px 0;"><strong>☁️</strong> ${weatherData.description}</p>
                <p style="margin: 4px 0;"><strong>💨</strong> ${weatherData.windSpeedMS} m/s</p>`;
        
        if (warning && warning.level > 0) {
            popupContent += `
                <div style="margin-top: 8px; padding: 6px; background: #fff3cd; border-left: 2px solid #ff6b6b; border-radius: 3px;">
                    <strong style="color: #d63031; font-size: 0.9em;">⚠️ Nivå ${warning.level}</strong>
                    <p style="margin: 3px 0; white-space: pre-line; font-size: 0.85em;">${warning.details}</p>
                </div>`;
        }
        
        popupContent += `</div>`;
        
        // Get marker icon based on warning level
        const cityIcon = getWarningIcon(warning ? warning.level : 0, true);
        
        const cityMarker = L.marker([city.lat, city.lon], { icon: cityIcon }).addTo(map);
        cityMarker.bindPopup(popupContent);
        cityMarkers.push(cityMarker);
        
    } catch (error) {
        console.log(`Could not load weather for ${city.name}:`, error.message);
    }
}

// Load warnings for a city
async function loadWarnings(city, date) {
    try {
        const url = `${API_CONFIG.warningsApi}/api/weather/${encodeURIComponent(city)}/${date}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.log(`Warnings not available for ${city}`);
            return null;
        }
        
        const data = await response.json();
        console.log('Warning API svar:', data);
        
        return {
            level: data.Level || 0,
            details: data.Details || ''
        };
    } catch (error) {
        console.warn(`Could not load warnings for ${city}:`, error.message);
        return null;
    }
}

// Get marker icon based on warning level
function getWarningIcon(level, isSmall = false) {
    const size = isSmall ? [25, 41] : [25, 41];
    const iconAnchor = isSmall ? [12, 41] : [12, 41];
    
    let iconUrl;
    
    // Color based on warning level
    switch (level) {
        case 0:
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
            break;
        case 1:
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';
            break;
        case 2:
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png';
            break;
        case 3:
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
            break;
        default: // 4 or higher
            iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
            break;
    }
    
    return L.icon({
        iconUrl: iconUrl,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: size,
        iconAnchor: iconAnchor,
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
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
