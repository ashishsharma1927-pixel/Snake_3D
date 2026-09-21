# Astro Snake 🐍🚀

Welcome to **Astro Snake**, a stunning 3D procedural snake game built with React, Three.js (React Three Fiber), and Vite!

Explore three entirely different biomes: **Deep Space**, **Neon City**, and the **Ocean Depth**. Pilot your snake in full 3D, grow your tail, and achieve the highest score!

## 🌟 Features
- **3D Procedural Slithering**: The snake is procedurally generated using React Three Fiber, allowing smooth, organic physics and movement in full 3D space!
- **Dynamic Biomes**: 
  - **Deep Space**: Fly through the galaxy and eat Planets and Asteroids!
  - **Neon City**: Slither through a Cyberpunk skyline and collect magical glowing Crystals!
  - **Ocean Depth**: Swim through coral reefs and hunt dynamically animated Fish!
- **Multi-Platform Controls**: Play on desktop with Keyboard controls, or play seamlessly on your Mobile Phone using the responsive on-screen Virtual Joystick and Pedals!
- **Glassmorphism UI**: Beautiful, interactive HUD and menus using modern CSS glassmorphism.

## 🎮 How to Play
- **W / UP Arrow**: Accelerate (GO)
- **S / DOWN Arrow**: Brake (STOP)
- **A & D / LEFT & RIGHT Arrows**: Turn Left and Right
- **UP & DOWN Arrows (or W/S on mobile)**: Pitch Up and Pitch Down in full 3D!

## 🚀 Running Locally
Make sure you have [Node.js](https://nodejs.org/) installed.
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the provided `localhost` link in your browser!

## 🌐 Deploying to GitHub Pages
This repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`) to effortlessly deploy the game to GitHub Pages!

1. Create a GitHub repository and push this code.
2. Go to your repository settings in GitHub.
3. Under **Pages**, set the **Source** to **GitHub Actions**.
4. GitHub will automatically build and deploy your game!

*(Note: If you are deploying to a project page e.g. `yourname.github.io/astro-snake`, ensure you add `base: '/astro-snake/'` to your `vite.config.ts` file!)*
