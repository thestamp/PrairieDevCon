# 🌍 3D Globe Location Tracker

An interactive web application that allows users to mark cities on a beautiful 3D globe, visualize them with pins and flight trails, and manage their location collection through a professional interface.

![Project Status](https://img.shields.io/badge/status-ready-success)
![WebGL](https://img.shields.io/badge/WebGL-2.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-r128-orange)

## ✨ Features

### 🗺️ Interactive 3D Globe
- Realistic 3D Earth rendering with WebGL/Three.js
- Smooth auto-rotation with pause on interaction
- Manual rotation, zoom, and pan controls
- Beautiful starfield background with thousands of stars
- Atmospheric glow effect around the globe

### 📍 City Management
- Add cities via geocoding (OpenStreetMap Nominatim API)
- Visual pins marking each city location
- Dotted flight trails connecting cities in sequence
- Click table rows to focus on specific cities
- Delete individual cities or clear all
- Automatic sequence management

### 💾 Data Persistence
- Automatic saving to browser localStorage
- Restore all cities, pins, and trails on page reload
- No server required - fully client-side

### 🎨 Professional UI
- Modern dark space theme
- Fully responsive design (desktop, tablet, mobile)
- Touch gesture support for mobile devices
- Smooth animations and transitions
- Toast notifications and confirmation modals
- Accessible keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Modern web browser with WebGL 2.0 support:
  - Chrome/Edge (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
- JavaScript enabled
- Internet connection (for geocoding and Three.js CDN)

### Installation

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Start adding cities!**

That's it! No build process or dependencies to install.

### Alternative: Local Server (Recommended)

For the best experience, serve the files through a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📖 Usage Guide

### Adding a City

1. Type a city name in the input field
2. Press **Enter** or click **Add City**
3. Watch as the pin appears on the globe and a flight trail connects to the previous city

### Interacting with the Globe

- **Rotate**: Click and drag on the globe
- **Zoom**: Use mouse wheel or +/- buttons
- **Reset View**: Click the ⟲ button
- **Toggle Auto-Rotation**: Click the ↻ button
- **Focus on City**: Click any row in the cities table

### Managing Cities

- **View Details**: Click on a table row to focus on that city
- **Delete City**: Click the 🗑️ button in the table
- **Clear All**: Click the "Clear All" button (with confirmation)

### Mobile/Touch Devices

- **Rotate**: One-finger drag
- **Zoom**: Two-finger pinch
- **Pan**: Two-finger drag

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Three.js** | 3D graphics and WebGL rendering |
| **Vanilla JavaScript** | Core application logic |
| **CSS3** | Professional styling and animations |
| **OpenStreetMap Nominatim** | Free geocoding API |
| **LocalStorage API** | Client-side data persistence |

## 📁 Project Structure

```
3D-Globe-Tracker/
├── index.html          # Main HTML structure
├── app.js              # Application logic & Three.js code
├── styles.css          # Complete styling
├── REQUIREMENTS.md     # Detailed requirements document
└── README.md           # This file
```

## 🎯 Key Features Implementation

### Globe Rendering
- Earth sphere with procedurally generated land/ocean texture
- Atmospheric glow effect using multiple materials
- 5,000+ stars with size and color variation
- Smooth 60 FPS rendering

### Pin System
- 3D cone geometry representing location markers
- Proper orientation pointing outward from Earth's center
- Latitude/longitude to 3D vector conversion
- Dynamic addition/removal

### Flight Trails
- Dotted line materials for visual distinction
- Great circle path calculation (shortest distance on sphere)
- Arc elevation for 3D depth
- Automatic recalculation on city deletion

### Data Management
- JSON-based localStorage structure
- Version tracking for future migrations
- Duplicate prevention
- Sequence order management

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

**Note**: WebGL 2.0 support is required. Most modern browsers from 2020+ support this.

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above (full side-by-side layout)
- **Tablet**: 768px - 1023px (adjusted sidebar width)
- **Mobile**: Below 768px (stacked layout, globe top / table bottom)

## 🔧 Configuration

You can modify the globe behavior by editing the `config` object in `app.js`:

```javascript
this.config = {
    autoRotateSpeed: 0.002,    // Rotation speed (radians per frame)
    idleTimeout: 3000,         // Time before auto-rotate resumes (ms)
    earthRadius: 5,            // Globe radius
    pinHeight: 0.15,           // Pin size
    pinColor: 0xff4444,        // Pin color (hex)
    trailColor: 0x00ffff,      // Flight trail color (hex)
    cameraDistance: 15         // Initial camera distance
};
```

## 🎨 Customization

### Changing Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #00d4ff;     /* Cyan accent */
    --accent-secondary: #7c3aed;   /* Purple accent */
    --bg-primary: #0a0e27;         /* Dark background */
    /* ... more variables */
}
```

### Using Real Earth Textures

For a more realistic Earth, replace the procedural texture with a real image:

```javascript
// In createGlobe() method
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('path/to/earth-texture.jpg');

const material = new THREE.MeshPhongMaterial({
    map: earthTexture,
    // ... other properties
});
```

Recommended texture sources:
- [NASA Visible Earth](https://visibleearth.nasa.gov/)
- [Solar System Scope](https://www.solarsystemscope.com/textures/)

## ⚡ Performance

- **Target FPS**: 60 (typically achieves 60 FPS on modern hardware)
- **Load Time**: < 3 seconds on standard broadband
- **Tested with**: 1000+ cities without performance degradation
- **Memory**: Efficient Three.js scene management

### Performance Tips

1. **Reduce star count** for slower devices (edit `starCount` in `createStarfield()`)
2. **Lower globe resolution** (reduce segments in `SphereGeometry`)
3. **Disable atmospheric glow** for mobile devices

## 🐛 Troubleshooting

### Globe doesn't appear
- Check browser console for errors
- Verify WebGL is supported: visit https://get.webgl.org/
- Try a different browser

### Cities not saving
- Check if localStorage is enabled
- Some browsers block localStorage in private/incognito mode
- Check browser storage quota

### Geocoding not working
- Check internet connection
- API rate limits may apply (Nominatim: 1 request/second)
- Try adding a delay between requests

### Performance issues
- Close other tabs/applications
- Reduce star count in `createStarfield()`
- Update graphics drivers

## 🚀 Future Enhancements

Potential features for future versions:

- [ ] Import/export cities (JSON/CSV)
- [ ] Shareable links with encoded data
- [ ] Multiple named routes/collections
- [ ] Photo attachments for cities
- [ ] Visit status (visited/planned)
- [ ] Distance calculations between cities
- [ ] Weather integration
- [ ] 3D building visualization
- [ ] Flight animations along trails
- [ ] User accounts and cloud sync

## 📄 License

This project is open source and available for educational and personal use.

## 🙏 Acknowledgments

- **Three.js** - Amazing 3D library
- **OpenStreetMap Nominatim** - Free geocoding service
- **NASA** - Inspiration for space-themed design

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the detailed REQUIREMENTS.md document
3. Check browser compatibility

## 🎉 Enjoy Exploring the World!

Start marking your dream destinations, places you've visited, or cities you want to explore. Watch as your personal globe comes to life with pins and trails spanning the Earth! 🌍✈️
