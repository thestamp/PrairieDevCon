// Storage key for localStorage
const STORAGE_KEY = 'globeCities';

// Global variables
let scene, camera, renderer, globe, stars;
let cities = [];
let pins = [];
let trails = [];

// Initialize the application
function init() {
    loadCities();
    setupScene();
    setupGlobe();
    setupStars();
    setupLights();
    animate();
    setupEventListeners();
    updateCityTable();
}

// Load cities from localStorage
function loadCities() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        cities = JSON.parse(stored);
    }
}

// Save cities to localStorage
function saveCities() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

// Setup Three.js scene
function setupScene() {
    const canvas = document.getElementById('globeCanvas');
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        45,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 3;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

// Create the Earth globe
function setupGlobe() {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Create earth-like material
    const material = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
        specular: 0x333333,
        shininess: 25,
        wireframe: false
    });
    
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    
    // Add grid lines for continents effect
    const gridGeometry = new THREE.SphereGeometry(1.001, 32, 32);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0x228844,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(grid);
}

// Create starry background
function setupStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.01,
        transparent: true,
        opacity: 0.8
    });
    
    const starsVertices = [];
    for (let i = 0; i < 3000; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Setup lighting
function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate globe
    globe.rotation.y += 0.002;
    
    // Rotate stars slowly in opposite direction
    stars.rotation.y -= 0.0002;
    stars.rotation.x -= 0.0001;
    
    // Rotate pins and trails with globe
    pins.forEach(pin => {
        pin.rotation.y += 0.002;
    });
    
    trails.forEach(trail => {
        trail.rotation.y += 0.002;
    });
    
    renderer.render(scene, camera);
}

// Convert lat/lon to 3D coordinates
function latLonToVector3(lat, lon, radius = 1) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

// Create a pin at a location
function createPin(lat, lon, color = 0xff6b6b) {
    const pinGroup = new THREE.Group();
    
    // Pin marker
    const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: color });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    const position = latLonToVector3(lat, lon, 1.01);
    marker.position.copy(position);
    
    // Glow effect
    const glowGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    
    pinGroup.add(marker);
    pinGroup.add(glow);
    
    scene.add(pinGroup);
    pins.push(pinGroup);
    
    return pinGroup;
}

// Create flight trail between two points
function createTrail(lat1, lon1, lat2, lon2) {
    const point1 = latLonToVector3(lat1, lon1, 1.02);
    const point2 = latLonToVector3(lat2, lon2, 1.02);
    
    // Create curve for the trail
    const midPoint = new THREE.Vector3()
        .addVectors(point1, point2)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(1.3); // Raise the arc
    
    const curve = new THREE.QuadraticBezierCurve3(point1, midPoint, point2);
    const points = curve.getPoints(50);
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
        color: 0x667eea,
        dashSize: 0.02,
        gapSize: 0.01,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
    });
    
    const trail = new THREE.Line(geometry, material);
    trail.computeLineDistances();
    
    scene.add(trail);
    trails.push(trail);
    
    return trail;
}

// Clear all pins and trails
function clearPinsAndTrails() {
    pins.forEach(pin => scene.remove(pin));
    trails.forEach(trail => scene.remove(trail));
    pins = [];
    trails = [];
}

// Update all pins and trails
function updateGlobe() {
    clearPinsAndTrails();
    
    // Add pins for each city
    cities.forEach(city => {
        createPin(city.lat, city.lon);
    });
    
    // Create trails between consecutive cities
    for (let i = 0; i < cities.length - 1; i++) {
        createTrail(
            cities[i].lat,
            cities[i].lon,
            cities[i + 1].lat,
            cities[i + 1].lon
        );
    }
}

// Geocode city name to coordinates
async function geocodeCity(cityName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'Globe Explorer App'
                }
            }
        );
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            const result = data[0];
            return {
                name: cityName,
                displayName: result.display_name,
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon),
                country: extractCountry(result.display_name)
            };
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        throw new Error('Failed to geocode city: ' + error.message);
    }
}

// Extract country from display name
function extractCountry(displayName) {
    const parts = displayName.split(',');
    return parts[parts.length - 1].trim();
}

// Add city
async function addCity(cityName) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = '';
    
    try {
        // Check if city already exists
        if (cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
            throw new Error('City already added');
        }
        
        const cityData = await geocodeCity(cityName);
        cities.push(cityData);
        saveCities();
        updateCityTable();
        updateGlobe();
        
        document.getElementById('cityInput').value = '';
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

// Delete city
function deleteCity(index) {
    cities.splice(index, 1);
    saveCities();
    updateCityTable();
    updateGlobe();
}

// Update city table
function updateCityTable() {
    const tbody = document.getElementById('citiesTableBody');
    const emptyState = document.getElementById('emptyState');
    const table = document.getElementById('citiesTable');
    const countSpan = document.getElementById('cityCount');
    
    tbody.innerHTML = '';
    countSpan.textContent = `(${cities.length})`;
    
    if (cities.length === 0) {
        emptyState.classList.add('show');
        table.classList.add('hide');
    } else {
        emptyState.classList.remove('show');
        table.classList.remove('hide');
        
        cities.forEach((city, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${city.name}</td>
                <td>${city.country}</td>
                <td><button class="delete-btn" onclick="deleteCity(${index})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('cityForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cityInput = document.getElementById('cityInput');
        const cityName = cityInput.value.trim();
        if (cityName) {
            await addCity(cityName);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const canvas = document.getElementById('globeCanvas');
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Mouse interaction for globe rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    const canvas = document.getElementById('globeCanvas');
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            globe.rotation.y += deltaX * 0.005;
            globe.rotation.x += deltaY * 0.005;
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });
}

// Start the application when page loads
window.addEventListener('DOMContentLoaded', init);
