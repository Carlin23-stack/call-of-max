# ☢ CALL OF MAX ☢

An 8-bit retro shooter game with an engaging campaign. Play as MAX and fight through 5 levels of increasing difficulty to save the world!

## 🎮 Game Features

- **5-Level Campaign**: Progress through increasingly challenging levels
- **8-Bit Pixel Art Style**: Classic retro graphics with a modern twist
- **Enemy AI**: Enemies pursue and shoot at the player
- **Dynamic Difficulty**: Each level gets harder with more enemies and faster movement
- **Score System**: Rack up points by defeating enemies
- **Health System**: Manage your health throughout the campaign
- **Explosive Combat**: Visual feedback with explosion effects

## 🎯 How to Play

### Controls
- **Movement**: Use Arrow Keys or WASD
- **Shoot**: Click the mouse to fire bullets in the direction of your cursor
- **Objective**: Defeat all enemies in each level to progress

### Gameplay
1. Start the campaign from the main menu
2. Destroy all enemies in the current level
3. Progress to the next level (5 levels total)
4. Complete all levels to win the campaign and save the world!

### Health & Combat
- Start with 100 health
- Each enemy collision: -15 health
- Each enemy bullet hit: -10 health
- Defeating an enemy: +10 points
- All health is restored when advancing to the next level

## 📊 Level Progression

| Level | Enemies | Difficulty | Enemy Color |
|-------|---------|------------|-------------|
| 1 | 5 | Easy | Red |
| 2 | 8 | Medium | Orange |
| 3 | 11 | Hard | Red |
| 4 | 14 | Very Hard | Orange |
| 5 | 17 | Extreme | Red |

## 🚀 Getting Started

### Option 1: Play Online (GitHub Pages)
Visit: https://carlin23-stack.github.io/call-of-max/

### Option 2: Local Installation
1. Clone the repository
   ```bash
   git clone https://github.com/Carlin23-stack/call-of-max.git
   cd call-of-max
   ```

2. Open in your browser
   ```bash
   # Mac
   open index.html
   
   # Linux
   xdg-open index.html
   
   # Windows
   start index.html
   ```

## 📁 Project Structure

```
call-of-max/
├── index.html      # Main game HTML file
├── game.js         # Game logic and mechanics
├── README.md       # This file
└── LICENSE         # MIT License
```

## 🎨 Game Design

### Visual Style
- 8-bit pixel art aesthetic
- Green terminal-style color scheme (#00ff00)
- Grid-based background for retro feel
- Simple geometric shapes for game objects

### Player Character (MAX)
- 16x24 pixel character
- Green colored with animated eyes
- Orange gun attachment

### Enemies
- 14x14 pixel hostile units
- Intelligent movement (chase player)
- Shoot bullets at regular intervals
- Color varies by level (red/orange)

## 🔧 Technologies

- **HTML5**: Game canvas and structure
- **CSS3**: Styling and animations
- **JavaScript**: Game logic and rendering
- **Canvas API**: 2D graphics rendering

## 📈 Future Enhancements

- [ ] Power-up items
- [ ] Sound effects and music
- [ ] Boss encounters
- [ ] Weapon upgrades
- [ ] High score leaderboard
- [ ] Mobile touch controls
- [ ] Story/dialogue sequences
- [ ] Additional levels

## 🎓 Code Highlights

### Game Loop
The game runs on a smooth 60 FPS loop using `requestAnimationFrame`:
```javascript
function gameLoop() {
    updatePlayer();
    updateBullets();
    updateEnemies();
    draw();
    requestAnimationFrame(gameLoop);
}
```

### Collision Detection
Efficient rectangle-based collision detection:
```javascript
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}
```

### Enemy AI
Enemies track and pursue the player:
```javascript
// Move towards player
const dx = player.x - enemy.x;
const dy = player.y - enemy.y;
const dist = Math.sqrt(dx * dx + dy * dy);
enemy.x += (dx / dist) * enemy.speed;
enemy.y += (dy / dist) * enemy.speed;
```

## 🏆 Victory Condition

Complete all 5 levels and defeat every enemy to win the campaign!
Your final score will be displayed when you complete the game.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created by **Carlin23-stack**

---

**Play Call of Max today and become the ultimate 8-bit warrior! ☢**

*Made with 💚 and pixel art passion*