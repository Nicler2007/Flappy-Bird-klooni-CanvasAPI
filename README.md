# 🐦 Flappy Bird Clone (HTML Canvas API)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-blue)  
![Canvas API](https://img.shields.io/badge/Canvas-API-green)  

A Flappy Bird–style browser game built with **HTML Canvas API and JavaScript**.  
The goal of the game is to guide the bird through pipe pairs and collect as many points as possible.  

---

## 🎮 Features
- Classic Flappy Bird mechanics  
- Randomly generated pipes  
- Scoring + high score saved to `localStorage`  
- State machine: **MENU → READY → PLAYING → GAME OVER**  
- Responsive (works on mobile as well)  
- Sound effects (flap, point, hit, die)  
- Lightweight and modular code structure  

---

## 🛠️ Technologies
- **HTML5 Canvas API** – for rendering and animation  
- **JavaScript (ES Modules)** – game logic and input handling  
- **CSS3** – simple UI and styling  
- **localStorage** – save high score  

---

## 📂 Project Structure
```text
/project-root
│── index.html
│── style.css
│── /assets        # images, sounds, sprite sheet
│── /js
│   ├── main.js    # initialization, game loop
│   ├── game.js    # world state
│   ├── bird.js    # bird physics and animation
│   ├── pipes.js   # pipe generation and recycling
│   ├── background.js
│   ├── ui.js      # HUD and menus
│   ├── audio.js   # sounds
│   └── storage.js # localStorage helpers

🚀 Getting Started
Clone and run
bash
Kopioi koodi
git clone https://github.com/<username>/flappy-bird-clone.git
cd flappy-bird-clone
Run in browser
Open index.html in your browser

Or run with dev server (Vite example)
bash
Kopioi koodi
npm install -g vite
vite
🎯 Controls
Space / Mouse click / Touch → Bird jumps

M → Toggle mute

📅 Development Schedule (estimated)
Day 1: Setup and game loop

Day 2: Bird and inputs

Day 3: Pipes and collisions

Day 4: Scoring and state machine

Day 5: Graphics and sounds

Day 6: Storage and settings

Day 7: Testing and release

🌟 Future Ideas
Day/night theme

Special pipes and challenges

Online scoreboard

PWA support (offline and installable)

✍️ Author
Nico Hede

📜 License
This project is licensed under the MIT License.
