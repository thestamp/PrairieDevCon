/* ==========================================
   ADVANCED CONFIGURATION GUIDE
   ========================================== */

/*
This file documents various customization options available in the 
3D Globe Location Tracker application.
*/

// ==========================================
// 1. GLOBE BEHAVIOR (app.js)
// ==========================================

// Location: Inside GlobeApp constructor
this.config = {
    autoRotateSpeed: 0.002,    // Speed of auto-rotation (radians/frame)
                                // Higher = faster, Lower = slower
                                // Recommended: 0.001 - 0.005
    
    idleTimeout: 3000,         // Milliseconds before auto-rotate resumes
                                // Default: 3000 (3 seconds)
                                // Recommended: 2000 - 5000
    
    earthRadius: 5,            // Radius of the globe in 3D units
                                // Default: 5
                                // Larger = bigger globe, smaller = tiny globe
    
    pinHeight: 0.15,           // Height of location pins
                                // Default: 0.15
                                // Adjust if pins seem too large/small
    
    pinColor: 0xff4444,        // Pin color (hex without #)
                                // Default: 0xff4444 (red)
                                // Examples: 0xff0000 (bright red)
                                //          0x00ff00 (green)
                                //          0xffaa00 (orange)
    
    trailColor: 0x00ffff,      // Flight trail color (hex without #)
                                // Default: 0x00ffff (cyan)
                                // Examples: 0xffff00 (yellow)
                                //          0xff00ff (magenta)
                                //          0xffffff (white)
    
    cameraDistance: 15         // Initial camera distance from globe
                                // Default: 15
                                // Closer = zoomed in, Further = zoomed out
};

// ==========================================
// 2. STARFIELD CUSTOMIZATION (app.js)
// ==========================================

// Location: Inside createStarfield() method

const starCount = 5000;        // Number of stars in background
                                // Default: 5000
                                // More = prettier but slower
                                // Less = faster but less impressive
                                // Recommended: 1000 - 10000

// Star positioning
const radius = 50 + Math.random() * 50;
                                // Stars appear between radius 50-100
                                // Increase for more distant stars

// Star size
sizes[i] = Math.random() * 2 + 0.5;
                                // Stars sized between 0.5 - 2.5
                                // Adjust multiplier for larger/smaller

// ==========================================
// 3. COLOR THEME (styles.css)
// ==========================================

:root {
    /* Background Colors */
    --bg-primary: #0a0e27;     // Main background
    --bg-secondary: #151a35;   // Sidebar background
    --bg-tertiary: #1e2542;    // Input/card backgrounds
    --bg-hover: #252d4f;       // Hover states
    
    /* Text Colors */
    --text-primary: #e8eaf0;   // Main text
    --text-secondary: #a8afc7; // Secondary text
    --text-muted: #6b7394;     // Muted/disabled text
    
    /* Accent Colors */
    --accent-primary: #00d4ff;     // Main accent (cyan)
    --accent-secondary: #7c3aed;   // Secondary accent (purple)
    --accent-success: #10b981;     // Success messages
    --accent-warning: #f59e0b;     // Warnings
    --accent-danger: #ef4444;      // Errors/delete actions
    
    /* Borders & Shadows */
    --border-color: #2d3551;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.5);
}

// EXAMPLE: Light Theme Alternative
// Replace the colors above with:
/*
:root {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --bg-tertiary: #e2e8f0;
    --bg-hover: #cbd5e1;
    
    --text-primary: #1e293b;
    --text-secondary: #475569;
    --text-muted: #94a3b8;
    
    --accent-primary: #0284c7;
    --accent-secondary: #7c3aed;
    --accent-success: #059669;
    --accent-warning: #d97706;
    --accent-danger: #dc2626;
    
    --border-color: #cbd5e1;
}
*/

// ==========================================
// 4. FLIGHT TRAIL STYLING (app.js)
// ==========================================

// Location: Inside createFlightTrail() method

const numPoints = 50;          // Number of points in trail curve
                                // More = smoother but more processing
                                // Default: 50
                                // Recommended: 30 - 100

const arcHeight = 0.5;         // Height of trail arc above surface
                                // Default: 0.5
                                // Higher = more dramatic curves
                                // Lower = flatter trails

// Dashed line material properties
const material = new THREE.LineDashedMaterial({
    dashSize: 0.1,             // Length of each dash
    gapSize: 0.05,             // Length of gap between dashes
    linewidth: 2,              // Line thickness (limited by WebGL)
    opacity: 0.8,              // Trail transparency (0-1)
    transparent: true
});

// ==========================================
// 5. RESPONSIVE BREAKPOINTS (styles.css)
// ==========================================

@media (max-width: 1024px) {
    // Tablet adjustments
    .sidebar { width: 350px; }
}

@media (max-width: 768px) {
    // Mobile layout - stacked
    .globe-container { height: 50vh; }
}

@media (max-width: 480px) {
    // Small mobile adjustments
}

// To change breakpoints, modify the pixel values above

// ==========================================
// 6. EARTH TEXTURE REPLACEMENT
// ==========================================

/*
To use a real Earth texture image instead of the procedural one:

1. Download high-resolution Earth texture (8K recommended)
   Sources: 
   - NASA Visible Earth: https://visibleearth.nasa.gov/
   - Solar System Scope: https://www.solarsystemscope.com/textures/

2. Place image file in project folder (e.g., 'earth-texture.jpg')

3. In app.js, replace the createGlobe() method's texture section:
*/

// REPLACE THIS SECTION:
/*
const canvas = document.createElement('canvas');
canvas.width = 2048;
// ... procedural texture code ...
const texture = new THREE.CanvasTexture(canvas);
*/

// WITH THIS:
/*
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('earth-texture.jpg');
*/

// Optional: Add bump map, specular map, etc.
/*
const bumpMap = textureLoader.load('earth-bump.jpg');
const specularMap = textureLoader.load('earth-specular.jpg');

const material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: bumpMap,
    bumpScale: 0.05,
    specularMap: specularMap,
    specular: new THREE.Color(0x333333),
    shininess: 5
});
*/

// ==========================================
// 7. PERFORMANCE OPTIMIZATION
// ==========================================

// For slower devices, reduce these values:

// 1. Star count (app.js, createStarfield)
const starCount = 2000;  // Instead of 5000

// 2. Globe resolution (app.js, createGlobe)
const geometry = new THREE.SphereGeometry(
    this.config.earthRadius, 
    32, 32  // Instead of 64, 64
);

// 3. Trail points (app.js, createFlightTrail)
const numPoints = 25;  // Instead of 50

// 4. Disable atmospheric glow (app.js, createGlobe)
// Comment out or remove the glow mesh creation

// ==========================================
// 8. GEOCODING API CONFIGURATION
// ==========================================

// Location: app.js, geocodeCity() method

// Current: OpenStreetMap Nominatim (Free, no API key)
const url = `https://nominatim.openstreetmap.org/search?...`;

// Alternative: Google Geocoding API (Requires API key)
/*
const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${GOOGLE_API_KEY}`;

// Parse differently for Google:
const result = data.results[0];
return {
    name: result.address_components[0].long_name,
    country: result.address_components.find(c => c.types.includes('country')).long_name,
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng
};
*/

// ==========================================
// 9. DATA STRUCTURE
// ==========================================

// LocalStorage JSON structure:
/*
{
    "cities": [
        {
            "id": "unique-id",
            "name": "New York",
            "country": "United States",
            "state": "New York",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "dateAdded": "2025-12-09T12:00:00Z",
            "sequenceOrder": 1
        }
    ],
    "version": "1.0.0",
    "lastUpdated": "2025-12-09T12:00:00Z"
}
*/

// To add custom fields, modify the city object in addCity() method

// ==========================================
// 10. CAMERA CONTROLS
// ==========================================

// Zoom limits (app.js, setupControls method)
this.camera.position.z = Math.max(8, Math.min(25, this.camera.position.z));
                                // Min: 8 (close)
                                // Max: 25 (far)
                                // Adjust for tighter/looser limits

// Rotation limits (vertical)
this.globe.rotation.x = Math.max(
    -Math.PI / 2,              // -90 degrees
    Math.min(Math.PI / 2, this.globe.rotation.x)  // +90 degrees
);
// Remove these lines to allow full vertical rotation

// ==========================================
// TIPS FOR CUSTOMIZATION
// ==========================================

/*
1. Always test changes in multiple browsers
2. Use browser dev tools (F12) to debug
3. Start with small changes
4. Keep backups of original values
5. Check console for errors after changes
6. Test on mobile devices for responsive changes
7. Use git to track your customizations

RECOMMENDED WORKFLOW:
1. Identify what you want to change
2. Find the relevant section in this guide
3. Locate the code in the actual files
4. Make your change
5. Refresh browser (Ctrl+F5 for hard refresh)
6. Test thoroughly
7. Revert if needed

Happy customizing! 🎨
*/
