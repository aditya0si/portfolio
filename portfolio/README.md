# Layered Parallax Zoom Portfolio Website

A cinematic, dark-themed personal portfolio with smooth scrolling, layered parallax depth, responsive typography, and an interactive particle canvas hero background. Built from scratch with vanilla technologies and modern animations.

---

## 🚀 Technologies Implemented

- **Core Structure**: Semantic HTML5 tags.
- **Design & Themes**: Custom vanilla CSS design system featuring cyber electric indigo and hyper teal colors, fully responsive grid systems, and glassmorphic card elements.
- **Physics Smooth Scroll**: [Lenis by Studio Freight](https://github.com/darkroomengineering/lenis) for buttery smooth mouse wheel momentum.
- **Animations Engine**: [GSAP (GreenSock Animation Platform)](https://gsap.com/) & [ScrollTrigger Plugin](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for scroll-linked layered parallax transitions.
- **Interactive Space Travel Background**: Optimized HTML5 `<canvas>` rendering loop inside `requestAnimationFrame` with constellation lines, edge fades, and vertical scroll-depth speed changes.

---

## 📂 File Architecture

```
portfolio/
├── index.html          # Semantic HTML core layout
├── css/
│   └── index.css       # Design tokens, variables, cards, buttons, responsive media queries
├── js/
│   ├── main.js         # Lenis and GSAP ScrollTrigger timeline configs, hamburger drawer morph logic
│   └── particles.js    # Canvas particle generator and constellation drift physics
└── README.md           # Documentation & instructions
```

---

## ⚡ How to Open and Run

This project is entirely zero-config and runs in any modern browser without installation, bundlers, or local server requirements.

1. **Option 1: Directly Open**
   Double-click `index.html` or drag it into any web browser (Chrome, Edge, Safari, Firefox).
   
2. **Option 2: Live Server Extension (Recommended)**
   If using VS Code, install the "Live Server" extension, right-click `index.html`, and choose **"Open with Live Server"** to enable automatic hot reloading as you customize content.

---

## 🛠️ Personalization Guide

To substitute the placeholder text with your real achievements and details, modify the respective sections inside `index.html`:

- **Hero Title & Subtitle**: Line ~53.
- **About Bio**: Line ~89.
- **Skills list**: Lines ~115 to ~175.
- **Projects**: Lines ~185 to ~290. Update details and point links to your live repositories.
- **Education timeline**: Lines ~300 to ~345.
- **Social links & Contact email**: Lines ~354 to ~379. Change the email addresses and profile handles to your own.
