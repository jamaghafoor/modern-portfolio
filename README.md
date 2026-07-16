# Abdul Ghafoor — Signal Portfolio

A sleek, modern, single-page React portfolio with a "transmission" and oscilloscope aesthetic. Built with React, Vite, Framer Motion, and Tailwind CSS. The design focuses on precise, mechanical motion, void backgrounds (`#0a0a0c`), and phosphor green (`#39ff88`) accents, steering clear of generic web patterns.

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

## ✨ Features

- **Signal Aesthetic:** Mechanical motion, thin hairline rules, and small monospace annotations. 
- **Generative Oscilloscopes:** Real-time 2D canvas waveforms with additive synthesis, capping at 30fps for smooth performance.
- **Glitch Transitions:** Full-screen CSS clip-path displacements triggered during section transitions.
- **Content-Driven:** All data (experience, projects, skills) is neatly organized in `src/data/content.js`.
- **Responsive & Accessible:** Fully responsive design that respects `prefers-reduced-motion` and keyboard navigation.

## 🚀 Getting Started

Ensure you have Node.js and `npm` installed.

```bash
# Clone the repo
git clone https://github.com/jamaghafoor/abdulghafoor-portfolio.git
cd modern-portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
# → http://localhost:5173/
```

## 🛠 Project Structure

```
src/
├── App.jsx                      # Root layout + state orchestration
├── main.jsx                     # React entry
├── index.css                    # Full design system (tokens, keyframes, reset)
├── data/
│   └── content.js               # All portfolio content as structured data
├── utils/
│   └── waveform.js              # Additive-synthesis waveform generation
├── hooks/
│   └── index.js                 # Utility hooks (scroll, motion, cursor, observer)
└── components/                  # UI components (CustomCursor, Waveform, Navigation, etc.)
```

## 🎨 Customisation

Update the data in `src/data/content.js` to change your information (experience, projects, skills, contact). 
Styles and color variables are defined in `src/index.css`.

## 👤 Built by

**Abdul Ghafoor**
- GitHub: [@jamaghafoor](https://github.com/jamaghafoor)
- Email: [abdulghafoor1525@gmail.com](mailto:abdulghafoor1525@gmail.com)
