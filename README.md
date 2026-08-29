# 📷 KHACHAAK — Official Photography Club of NMIMS MPSTME

> *"Capture the unseen. Frame the extraordinary."*

Khachaak is the premier photography and visual arts society of **Mukesh Patel School of Technology Management & Engineering (NMIMS MPSTME, Mumbai)**. This repository houses the official web platform built with high-performance WebGL shaders, camera optics aesthetics, dark luxury typography, and interactive photography showcases.

---

## ✨ Key Features & Architectural Highlights

- 🌀 **WebGL 3.0 Grid Distortion Shader Engine**: Custom `Three.js` fragment shader module (`js/grid-distortion.js`) providing real-time liquid mouse velocity distortion over high-resolution photography assets.
- 📸 **RAW Camera Viewfinder HUD**: Authentic camera optics UI elements including EXIF telemetry badges (`f/1.4`, `ISO 100`, `RAW 4K 60FPS`), focus reticle brackets, and lens reflections.
- 👑 **Hierarchical Core Team & Advisory Board**:
  - **Executive Board**: Presidents & Vice Presidents with custom 4:5 studio cards.
  - **Advisory Council**: Hierarchically organized Founding Past Presidents (`Godfather 🗿`, `Past Presidents`) and Past Vice Presidents.
- 🖼️ **Wall of Frames & Interactive Gallery**: Filterable photo showcase categorized by Street, Portrait, Event, and Architectural photography with 3D tilt interactions and lightboxes.
- ⏱️ **Live Flagship Event Countdown**: Dynamic real-time timer tracking upcoming flagship exhibitions (`Aperture 2026`).
- 🎨 **Typography & Design System**: Custom palette using `Plus Jakarta Sans`, `Space Grotesk`, `Bebas Neue`, and `Cormorant Garamond` on a `#050505` luxury dark canvas.
- 🔍 **SEO & Search Engine Crawling**: Complete `robots.txt` configuration and Open Graph meta telemetry for Google indexability.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Web Platform** | HTML5 / Vanilla JS (ES6+) | Semantic layout, modular design, fast DOM manipulation |
| **Styling & Theme** | Vanilla CSS3 | Custom variables, glassmorphism, responsive grid layouts |
| **Interactive Shaders** | Three.js (r128) & GLSL | WebGL `DataTexture` dynamic displacement grid distortion |
| **Typography** | Google Fonts | `Plus Jakarta Sans`, `Bebas Neue`, `Cormorant Garamond` |
| **Asset Pipeline** | Python (PIL / RemBG) | Automated subject extraction, 4:5 aspect ratio studio cards |

---

## 📂 Repository Structure

```
Khachaak/
├── index.html              # Main Landing Page with WebGL Hero & Feature Sections
├── team.html               # Core Executive Team Roster (Root Access)
├── advisory.html           # Advisory Board & Founding Leadership Roster
├── events.html             # Flagship Events, Workshops & Registration Modal
├── gallery.html            # Wall of Frames Photography Showcase
├── robots.txt              # Search Engine Crawling Instructions
├── README.md               # Repository Documentation & Overview
│
├── team/                   # Team Clean Path Entry (/team/)
│   └── index.html
├── advisory/               # Advisory Clean Path Entry (/advisory/)
│   └── index.html
├── events/                 # Events Clean Path Entry (/events/)
│   └── index.html
├── gallery/                # Gallery Clean Path Entry (/gallery/)
│   └── index.html
│
├── css/
│   └── style.css           # Core Design System, Glassmorphism & Responsive Layouts
│
├── js/
│   ├── grid-distortion.js  # Three.js WebGL DataTexture Shader Engine
│   └── script.js           # Navigation, Scroll Interactions, Countdown & Modals
│
└── assets/
    ├── logos/              # Club Crest & Favicon Assets
    ├── street/             # High-Res WebGL Hero Photography Assets
    ├── team/               # Processed 4:5 Studio Member Cards
    ├── advisory/           # Processed 4:5 Studio Advisor Cards
    └── gallery/            # Photography Showcase High-Res Media
```

---

## 🚀 Local Development Setup

No complex build step or framework required. You can serve the platform locally using Python's built-in HTTP server:

```bash
# 1. Clone the repository
git clone https://github.com/sachinkumar-gg/khachaak.git
cd Khachaak

# 2. Start local development server
python3 -m http.server 8090

# 3. Open in Browser
# Access http://localhost:8090 in your preferred browser.
```

---

## 👑 Leadership & Advisory Board

### Executive Leadership (2026)
- **Arnav Jain** — President & Executive Lead
- **Nishant Das** — President & Executive Lead
- **Sachin Kumar** — Vice President & Tech Lead
- **Yash Mandot** — Vice President & Creative Lead

### Advisory Council (Founding Board)
- **Dhruv Gundesha** — Godfather 🗿 & Past President
- **Nishchay Jain** — Past President & Operations Advisor
- **Sidharth Baid** — Past Vice President & Strategic Mentor
- **Shubham Nayak** — Past Vice President & Technical Advisor

---

## 📄 License & Ownership

© **Khachaak - Official Photography Club of NMIMS MPSTME**. All rights reserved. Photography assets and visual branding remain the property of Khachaak MPSTME.
