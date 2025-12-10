// Data Storage
let cities = [];
let globe;

// DOM Elements
const cityInput = document.getElementById('cityInput');
const addButton = document.getElementById('addButton');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const statusMessage = document.getElementById('statusMessage');
const resetViewButton = document.getElementById('resetView');

// Initialize application
function init() {
    loadFromStorage();
    initGlobe();
    updateTable();
    updateGlobe();
    
    // Event listeners
    addButton.addEventListener('click', handleAddCity);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddCity();
    });
    resetViewButton.addEventListener('click', resetGlobeView);
}

// Initialize 3D Globe
function initGlobe() {
    globe = Globe()
        (document.getElementById('globeViz'))
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .pointAltitude(0.01)
        .pointRadius(0.5)
        .pointColor(() => '#00d4ff')
        .pointLabel(d => `
            <div style="
                background: rgba(0, 0, 0, 0.8);
                padding: 8px 12px;
                border-radius: 6px;
                color: #00d4ff;
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
                border: 1px solid #00d4ff;
            ">
                📍 ${d.city}
            </div>
        `)
        .arcColor(() => 'rgba(0, 212, 255, 0.6)')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(3000)
        .arcStroke(0.5)
        .arcsTransitionDuration(1000);

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
}

// Geocode city name to coordinates
async function geocodeCity(cityName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&limit=1`,
            {
                headers: {
                    'User-Agent': 'Globe City Tracker'
                }
            }
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}

// Handle adding a new city
async function handleAddCity() {
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        showStatus('Please enter a city name', 'error');
        return;
    }
    
    // Check if city already exists
    if (cities.some(c => c.city.toLowerCase() === cityName.toLowerCase())) {
        showStatus('This city is already pinned', 'error');
        return;
    }
    
    // Show loading state
    addButton.classList.add('loading');
    addButton.disabled = true;
    showStatus('Locating city...', 'success');
    
    try {
        const coords = await geocodeCity(cityName);
        
        const newCity = {
            id: Date.now(),
            city: cityName,
            lat: coords.lat,
            lng: coords.lng,
            displayName: coords.displayName
        };
        
        cities.push(newCity);
        saveToStorage();
        updateTable();
        updateGlobe();
        
        // Focus on new location
        globe.pointOfView({
            lat: coords.lat,
            lng: coords.lng,
            altitude: 2
        }, 1000);
        
        cityInput.value = '';
        showStatus(`Successfully added ${cityName}!`, 'success');
        
        setTimeout(() => {
            hideStatus();
        }, 3000);
        
    } catch (error) {
        showStatus('Could not find that city. Please check the spelling.', 'error');
    } finally {
        addButton.classList.remove('loading');
        addButton.disabled = false;
    }
}

// Delete a city
function deleteCity(id) {
    cities = cities.filter(c => c.id !== id);
    saveToStorage();
    updateTable();
    updateGlobe();
    showStatus('City removed', 'success');
    
    setTimeout(() => {
        hideStatus();
    }, 2000);
}

// Update the table display
function updateTable() {
    tableBody.innerHTML = '';
    
    if (cities.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    cities.forEach((city, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${city.city}</td>
            <td>${city.lat.toFixed(4)}, ${city.lng.toFixed(4)}</td>
            <td>
                <button class="btn-delete" onclick="deleteCity(${city.id})">
                    Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update globe visualization
function updateGlobe() {
    if (!globe) return;
    
    // Update points
    const points = cities.map(city => ({
        lat: city.lat,
        lng: city.lng,
        city: city.city
    }));
    
    globe.pointsData(points);
    
    // Update arcs (connecting consecutive cities)
    const arcs = [];
    for (let i = 0; i < cities.length - 1; i++) {
        arcs.push({
            startLat: cities[i].lat,
            startLng: cities[i].lng,
            endLat: cities[i + 1].lat,
            endLng: cities[i + 1].lng
        });
    }
    
    globe.arcsData(arcs);
}

// Reset globe view
function resetGlobeView() {
    if (globe) {
        globe.pointOfView({
            lat: 0,
            lng: 0,
            altitude: 2.5
        }, 1000);
    }
}

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
}

// Hide status message
function hideStatus() {
    statusMessage.className = 'status-message';
}

// LocalStorage functions
function saveToStorage() {
    localStorage.setItem('globe-cities', JSON.stringify(cities));
}

function loadFromStorage() {
    const stored = localStorage.getItem('globe-cities');
    if (stored) {
        try {
            cities = JSON.parse(stored);
        } catch (error) {
            console.error('Error loading from storage:', error);
            cities = [];
        }
    }
}

// Make deleteCity available globally
window.deleteCity = deleteCity;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
