// ==========================================
// 3D Globe Location Tracker
// ==========================================

class GlobeApp {
    constructor() {
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.controls = null;
        
        // Collections
        this.cities = [];
        this.pins = [];
        this.trails = [];
        this.stars = null;
        
        // State
        this.autoRotate = true;
        this.lastInteractionTime = Date.now();
        this.isUserInteracting = false;
        this.selectedCity = null;
        
        // Configuration
        this.config = {
            autoRotateSpeed: 0.002,
            idleTimeout: 3000,
            earthRadius: 5,
            pinHeight: 0.15,
            pinColor: 0xff4444,
            trailColor: 0x00ffff,
            cameraDistance: 15
        };
        
        this.init();
    }
    
    // ==========================================
    // INITIALIZATION
    // ==========================================
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.createStarfield();
        this.createGlobe();
        this.setupLights();
        this.setupControls();
        this.setupEventListeners();
        this.loadCitiesFromStorage();
        this.animate();
        
        // Hide loading screen
        document.getElementById('loading').style.display = 'none';
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
    }
    
    setupCamera() {
        const canvas = document.getElementById('globe-canvas');
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, this.config.cameraDistance);
    }
    
    setupRenderer() {
        const canvas = document.getElementById('globe-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    
    // ==========================================
    // 3D SCENE CREATION
    // ==========================================
    
    createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            // Random position in sphere
            const radius = 50 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Star color variation (white to blue-white to yellow-white)
            const colorVariation = Math.random();
            colors[i * 3] = 0.8 + Math.random() * 0.2; // R
            colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
            colors[i * 3 + 2] = colorVariation > 0.7 ? 0.6 + Math.random() * 0.4 : 0.9 + Math.random() * 0.1; // B
            
            // Star size variation
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }
    
    createGlobe() {
        // Earth geometry
        const geometry = new THREE.SphereGeometry(this.config.earthRadius, 64, 64);
        
        // Create a simple textured Earth using a gradient
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Ocean gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a4d6d');
        gradient.addColorStop(0.5, '#0d3a52');
        gradient.addColorStop(1, '#1a4d6d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Simple land masses (simplified continents)
        ctx.fillStyle = '#2d5a3a';
        // North America
        ctx.fillRect(200, 300, 400, 300);
        // South America
        ctx.fillRect(400, 600, 200, 350);
        // Europe
        ctx.fillRect(900, 250, 250, 200);
        // Africa
        ctx.fillRect(950, 450, 300, 400);
        // Asia
        ctx.fillRect(1200, 200, 600, 500);
        // Australia
        ctx.fillRect(1500, 700, 250, 200);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        // Material with atmosphere glow
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 5,
            specular: new THREE.Color(0x333333)
        });
        
        this.globe = new THREE.Mesh(geometry, material);
        this.scene.add(this.globe);
        
        // Add atmospheric glow
        const glowGeometry = new THREE.SphereGeometry(this.config.earthRadius * 1.05, 64, 64);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.globe.add(glow);
    }
    
    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
    }
    
    // ==========================================
    // CONTROLS & INTERACTION
    // ==========================================
    
    setupControls() {
        const canvas = document.getElementById('globe-canvas');
        
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.isUserInteracting = true;
            this.lastInteractionTime = Date.now();
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;
                
                this.globe.rotation.y += deltaX * 0.005;
                this.globe.rotation.x += deltaY * 0.005;
                
                // Limit vertical rotation
                this.globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.globe.rotation.x));
            }
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            setTimeout(() => {
                this.isUserInteracting = false;
            }, 100);
        });
        
        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
            this.isUserInteracting = false;
        });
        
        // Zoom with mouse wheel
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.lastInteractionTime = Date.now();
            
            const zoomSpeed = 0.5;
            const delta = e.deltaY > 0 ? 1 : -1;
            
            this.camera.position.z += delta * zoomSpeed;
            this.camera.position.z = Math.max(8, Math.min(25, this.camera.position.z));
        });
        
        // Touch support
        let touchStart = null;
        let touchDistance = 0;
        
        canvas.addEventListener('touchstart', (e) => {
            this.isUserInteracting = true;
            this.lastInteractionTime = Date.now();
            
            if (e.touches.length === 1) {
                touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchDistance = Math.sqrt(dx * dx + dy * dy);
            }
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1 && touchStart) {
                const deltaX = e.touches[0].clientX - touchStart.x;
                const deltaY = e.touches[0].clientY - touchStart.y;
                
                this.globe.rotation.y += deltaX * 0.005;
                this.globe.rotation.x += deltaY * 0.005;
                this.globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.globe.rotation.x));
                
                touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const delta = distance - touchDistance;
                
                this.camera.position.z -= delta * 0.01;
                this.camera.position.z = Math.max(8, Math.min(25, this.camera.position.z));
                
                touchDistance = distance;
            }
        });
        
        canvas.addEventListener('touchend', () => {
            touchStart = null;
            touchDistance = 0;
            setTimeout(() => {
                this.isUserInteracting = false;
            }, 100);
        });
    }
    
    // ==========================================
    // CITY MANAGEMENT
    // ==========================================
    
    async addCity(cityName) {
        if (!cityName.trim()) {
            this.showMessage('Please enter a city name', 'error');
            return;
        }
        
        // Check for duplicate
        if (this.cities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
            this.showMessage('City already added', 'error');
            return;
        }
        
        try {
            const cityData = await this.geocodeCity(cityName);
            
            if (!cityData) {
                this.showMessage('City not found. Please try again.', 'error');
                return;
            }
            
            const city = {
                id: this.generateId(),
                name: cityData.name,
                country: cityData.country,
                state: cityData.state || '',
                latitude: cityData.latitude,
                longitude: cityData.longitude,
                dateAdded: new Date().toISOString(),
                sequenceOrder: this.cities.length + 1
            };
            
            this.cities.push(city);
            this.addPinToGlobe(city);
            this.updateFlightTrails();
            this.updateTable();
            this.saveCitiesToStorage();
            
            this.showMessage(`✓ ${city.name} added successfully`, 'success');
            this.showToast(`Added ${city.name}, ${city.country}`);
            
            // Clear input
            document.getElementById('city-input').value = '';
            
        } catch (error) {
            console.error('Error adding city:', error);
            this.showMessage('Error adding city. Please try again.', 'error');
        }
    }
    
    async geocodeCity(cityName) {
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1&addressdetails=1`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'GlobeLocationTracker/1.0'
                }
            });
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                const result = data[0];
                return {
                    name: result.address.city || result.address.town || result.address.village || result.name,
                    country: result.address.country,
                    state: result.address.state || result.address.region,
                    latitude: parseFloat(result.lat),
                    longitude: parseFloat(result.lon)
                };
            }
            
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }
    
    deleteCity(cityId) {
        const city = this.cities.find(c => c.id === cityId);
        if (!city) return;
        
        this.showModal(
            'Delete City',
            `Are you sure you want to delete ${city.name}?`,
            () => {
                // Remove from array
                this.cities = this.cities.filter(c => c.id !== cityId);
                
                // Update sequence orders
                this.cities.forEach((c, index) => {
                    c.sequenceOrder = index + 1;
                });
                
                // Remove pin
                this.removePinFromGlobe(cityId);
                
                // Update trails and table
                this.updateFlightTrails();
                this.updateTable();
                this.saveCitiesToStorage();
                
                this.showToast(`Deleted ${city.name}`);
            }
        );
    }
    
    clearAllCities() {
        if (this.cities.length === 0) return;
        
        this.showModal(
            'Clear All Cities',
            `Are you sure you want to delete all ${this.cities.length} cities?`,
            () => {
                this.cities = [];
                
                // Remove all pins
                this.pins.forEach(pin => {
                    this.globe.remove(pin);
                });
                this.pins = [];
                
                // Remove all trails
                this.trails.forEach(trail => {
                    this.globe.remove(trail);
                });
                this.trails = [];
                
                this.updateTable();
                this.saveCitiesToStorage();
                this.showToast('All cities cleared');
            }
        );
    }
    
    focusOnCity(cityId) {
        const city = this.cities.find(c => c.id === cityId);
        if (!city) return;
        
        // Convert lat/lon to 3D position
        const phi = (90 - city.latitude) * (Math.PI / 180);
        const theta = (city.longitude + 180) * (Math.PI / 180);
        
        // Rotate globe to show city
        this.globe.rotation.y = -theta + Math.PI / 2;
        this.globe.rotation.x = phi - Math.PI / 2;
        
        this.showToast(`Focused on ${city.name}`);
    }
    
    // ==========================================
    // 3D PIN & TRAIL RENDERING
    // ==========================================
    
    addPinToGlobe(city) {
        // Create pin geometry (cone pointing up)
        const geometry = new THREE.ConeGeometry(0.08, this.config.pinHeight, 8);
        const material = new THREE.MeshPhongMaterial({ 
            color: this.config.pinColor,
            emissive: this.config.pinColor,
            emissiveIntensity: 0.3
        });
        const pin = new THREE.Mesh(geometry, material);
        
        // Position on globe
        const position = this.latLonToVector3(city.latitude, city.longitude, this.config.earthRadius + this.config.pinHeight / 2);
        pin.position.copy(position);
        
        // Orient pin to point outward from Earth center
        pin.lookAt(new THREE.Vector3(0, 0, 0));
        pin.rotateX(Math.PI);
        
        // Store reference
        pin.userData = { cityId: city.id };
        this.pins.push(pin);
        this.globe.add(pin);
    }
    
    removePinFromGlobe(cityId) {
        const pinIndex = this.pins.findIndex(p => p.userData.cityId === cityId);
        if (pinIndex !== -1) {
            this.globe.remove(this.pins[pinIndex]);
            this.pins.splice(pinIndex, 1);
        }
    }
    
    updateFlightTrails() {
        // Remove existing trails
        this.trails.forEach(trail => {
            this.globe.remove(trail);
        });
        this.trails = [];
        
        // Create new trails
        for (let i = 0; i < this.cities.length - 1; i++) {
            const cityA = this.cities[i];
            const cityB = this.cities[i + 1];
            
            const trail = this.createFlightTrail(cityA, cityB);
            this.trails.push(trail);
            this.globe.add(trail);
        }
    }
    
    createFlightTrail(cityA, cityB) {
        const startPos = this.latLonToVector3(cityA.latitude, cityA.longitude, this.config.earthRadius + 0.02);
        const endPos = this.latLonToVector3(cityB.latitude, cityB.longitude, this.config.earthRadius + 0.02);
        
        // Create curved path (great circle)
        const points = [];
        const numPoints = 50;
        
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            
            // Interpolate along great circle
            const point = new THREE.Vector3().lerpVectors(startPos, endPos, t);
            
            // Add arc height
            const arcHeight = 0.5;
            const heightFactor = Math.sin(t * Math.PI) * arcHeight;
            point.normalize().multiplyScalar(this.config.earthRadius + 0.02 + heightFactor);
            
            points.push(point);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Dashed line material
        const material = new THREE.LineDashedMaterial({
            color: this.config.trailColor,
            dashSize: 0.1,
            gapSize: 0.05,
            linewidth: 2,
            opacity: 0.8,
            transparent: true
        });
        
        const trail = new THREE.Line(geometry, material);
        trail.computeLineDistances(); // Required for dashed lines
        
        return trail;
    }
    
    latLonToVector3(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        return new THREE.Vector3(x, y, z);
    }
    
    // ==========================================
    // UI UPDATES
    // ==========================================
    
    updateTable() {
        const tbody = document.getElementById('cities-tbody');
        
        if (this.cities.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="5">
                        <div class="empty-message">
                            <p>📍 No cities added yet</p>
                            <p class="small">Start by entering a city name above</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.cities.map(city => `
            <tr data-city-id="${city.id}" class="city-row">
                <td>${city.sequenceOrder}</td>
                <td class="city-name">${city.name}</td>
                <td>${city.country}</td>
                <td class="coordinates">${city.latitude.toFixed(2)}°, ${city.longitude.toFixed(2)}°</td>
                <td>
                    <button class="delete-btn" onclick="app.deleteCity('${city.id}')" title="Delete">
                        🗑️
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add click handlers for focusing
        document.querySelectorAll('.city-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-btn')) {
                    const cityId = row.dataset.cityId;
                    this.focusOnCity(cityId);
                }
            });
        });
    }
    
    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('input-message');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }, 3000);
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    showModal(title, message, onConfirm) {
        const modal = document.getElementById('modal');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        
        modal.classList.add('show');
        
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');
        
        const confirm = () => {
            onConfirm();
            modal.classList.remove('show');
            cleanup();
        };
        
        const cancel = () => {
            modal.classList.remove('show');
            cleanup();
        };
        
        const cleanup = () => {
            confirmBtn.removeEventListener('click', confirm);
            cancelBtn.removeEventListener('click', cancel);
        };
        
        confirmBtn.addEventListener('click', confirm);
        cancelBtn.addEventListener('click', cancel);
    }
    
    // ==========================================
    // STORAGE
    // ==========================================
    
    saveCitiesToStorage() {
        try {
            const data = {
                cities: this.cities,
                version: '1.0.0',
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('globeTrackerData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.showToast('Warning: Could not save data');
        }
    }
    
    loadCitiesFromStorage() {
        try {
            const data = localStorage.getItem('globeTrackerData');
            if (data) {
                const parsed = JSON.parse(data);
                this.cities = parsed.cities || [];
                
                // Restore pins and trails
                this.cities.forEach(city => {
                    this.addPinToGlobe(city);
                });
                this.updateFlightTrails();
                this.updateTable();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    
    setupEventListeners() {
        // Add city button
        document.getElementById('add-city-btn').addEventListener('click', () => {
            const input = document.getElementById('city-input');
            this.addCity(input.value);
        });
        
        // Enter key in input
        document.getElementById('city-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCity(e.target.value);
            }
        });
        
        // Clear input button
        document.getElementById('clear-input').addEventListener('click', () => {
            document.getElementById('city-input').value = '';
            document.getElementById('city-input').focus();
        });
        
        // Clear all button
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            this.clearAllCities();
        });
        
        // Globe controls
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.camera.position.z = Math.max(8, this.camera.position.z - 1);
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.camera.position.z = Math.min(25, this.camera.position.z + 1);
        });
        
        document.getElementById('reset-view').addEventListener('click', () => {
            this.camera.position.set(0, 0, this.config.cameraDistance);
            this.globe.rotation.set(0, 0, 0);
            this.showToast('View reset');
        });
        
        document.getElementById('toggle-rotation').addEventListener('click', (e) => {
            this.autoRotate = !this.autoRotate;
            e.currentTarget.classList.toggle('active');
            this.showToast(this.autoRotate ? 'Auto-rotation enabled' : 'Auto-rotation disabled');
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('globe-canvas');
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        });
    }
    
    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Auto-rotation logic
        if (this.autoRotate && !this.isUserInteracting) {
            const timeSinceInteraction = Date.now() - this.lastInteractionTime;
            if (timeSinceInteraction > this.config.idleTimeout) {
                this.globe.rotation.y += this.config.autoRotateSpeed;
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // ==========================================
    // UTILITIES
    // ==========================================
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new GlobeApp();
});
