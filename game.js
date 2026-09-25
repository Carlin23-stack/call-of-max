// Call of Max - 8-bit Shooter Game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// Game States
const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over'
};

// Game Variables
let gameState = GAME_STATES.MENU;
let currentLevel = 1;
let totalScore = 0;
const MAX_LEVELS = 5;

// Player Object
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 16,
    height: 24,
    speed: 5,
    health: 100,
    maxHealth: 100,
    score: 0
};

// Bullets Array
let bullets = [];
let enemies = [];
let explosions = [];

// Input Handling
const keys = {};
let mouseX = 0;
let mouseY = 0;

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ') e.preventDefault();
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

document.addEventListener('click', () => {
    if (gameState === GAME_STATES.PLAYING) {
        shootBullet();
    }
});

// Draw Functions
function drawPixelRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawPixel(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

function drawPlayer() {
    // Body
    drawPixelRect(player.x, player.y, player.width, player.height, '#00ff00');
    // Eyes
    drawPixel(player.x + 4, player.y + 6, 2, '#000000');
    drawPixel(player.x + 10, player.y + 6, 2, '#000000');
    // Gun
    drawPixelRect(player.x + 6, player.y - 8, 4, 8, '#ffaa00');
}

function drawEnemy(enemy) {
    // Enemy body
    drawPixelRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);
    // Enemy eyes (angry)
    drawPixel(enemy.x + 3, enemy.y + 4, 2, '#ff0000');
    drawPixel(enemy.x + 9, enemy.y + 4, 2, '#ff0000');
}

function drawBullet(bullet) {
    drawPixel(bullet.x, bullet.y, 3, '#ffff00');
}

function drawExplosion(exp) {
    ctx.fillStyle = `rgba(255, ${255 - exp.life * 5}, 0, ${exp.life / 255})`;
    for (let i = 0; i < exp.particles; i++) {
        const angle = (i / exp.particles) * Math.PI * 2;
        const dist = (1 - exp.life / 255) * 30;
        const px = exp.x + Math.cos(angle) * dist;
        const py = exp.y + Math.sin(angle) * dist;
        drawPixel(px, py, 2, `rgba(255, ${255 - exp.life * 5}, 0, ${exp.life / 255})`);
    }
}

// Game Functions
function startGame() {
    document.getElementById('menu').classList.add('hidden');
    gameState = GAME_STATES.PLAYING;
    currentLevel = 1;
    totalScore = 0;
    player.health = player.maxHealth;
    player.score = 0;
    spawnEnemies();
    gameLoop();
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > MAX_LEVELS) {
        gameWon();
    } else {
        player.health = player.maxHealth;
        player.score = 0;
        bullets = [];
        enemies = [];
        explosions = [];
        document.getElementById('levelComplete').classList.remove('show');
        gameState = GAME_STATES.PLAYING;
        spawnEnemies();
    }
}

function gameWon() {
    alert(`🎉 CAMPAIGN COMPLETE!\nTotal Score: ${totalScore}\nYou saved the world as MAX!`);
    location.reload();
}

function spawnEnemies() {
    enemies = [];
    const enemyCount = 5 + (currentLevel - 1) * 3;
    
    for (let i = 0; i < enemyCount; i++) {
        const enemy = {
            x: Math.random() * (canvas.width - 16),
            y: Math.random() * (canvas.height / 2 - 50),
            width: 14,
            height: 14,
            speed: 1.5 + currentLevel * 0.3,
            health: 1,
            color: currentLevel % 2 === 0 ? '#ff0000' : '#ff6600',
            shootCooldown: 0,
            shootInterval: 100 + Math.random() * 100
        };
        enemies.push(enemy);
    }
}

function shootBullet() {
    const bullet = {
        x: player.x + player.width / 2,
        y: player.y,
        vx: (mouseX - (player.x + player.width / 2)) * 0.05,
        vy: (mouseY - player.y) * 0.05,
        speed: 8,
        life: 255
    };
    bullets.push(bullet);
}

function enemyShoots(enemy) {
    const bullet = {
        x: enemy.x + enemy.width / 2,
        y: enemy.y + enemy.height,
        vx: (player.x - enemy.x) * 0.02,
        vy: (player.y - enemy.y) * 0.02 + 3,
        speed: 4,
        isEnemy: true,
        life: 255
    };
    bullets.push(bullet);
}

function updatePlayer() {
    let dx = 0;
    let dy = 0;

    if (keys['arrowup'] || keys['w']) dy = -player.speed;
    if (keys['arrowdown'] || keys['s']) dy = player.speed;
    if (keys['arrowleft'] || keys['a']) dx = -player.speed;
    if (keys['arrowright'] || keys['d']) dx = player.speed;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x + dx));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y + dy));
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.life -= 5;

        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height || bullet.life <= 0) {
            bullets.splice(i, 1);
            continue;
        }

        // Collision with enemies
        if (!bullet.isEnemy) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (checkCollision(bullet, enemy)) {
                    enemies.splice(j, 1);
                    bullets.splice(i, 1);
                    player.score += 10;
                    totalScore += 10;
                    explosions.push({
                        x: bullet.x,
                        y: bullet.y,
                        life: 255,
                        particles: 8
                    });
                    break;
                }
            }
        } else {
            // Enemy bullet hits player
            if (checkCollision(bullet, player)) {
                player.health -= 10;
                bullets.splice(i, 1);
                explosions.push({
                    x: bullet.x,
                    y: bullet.y,
                    life: 255,
                    particles: 6
                });
                if (player.health <= 0) {
                    gameState = GAME_STATES.GAME_OVER;
                }
            }
        }
    }
}

function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        
        // Move towards player
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
        }

        // Keep in bounds
        enemy.x = Math.max(0, Math.min(canvas.width - enemy.width, enemy.x));
        enemy.y = Math.max(0, Math.min(canvas.height - enemy.height, enemy.y));

        // Shoot
        enemy.shootCooldown++;
        if (enemy.shootCooldown > enemy.shootInterval) {
            enemyShoots(enemy);
            enemy.shootCooldown = 0;
        }

        // Check collision with player
        if (checkCollision(enemy, player)) {
            player.health -= 15;
            if (player.health <= 0) {
                gameState = GAME_STATES.GAME_OVER;
            }
        }
    }

    // Check if level complete
    if (enemies.length === 0 && gameState === GAME_STATES.PLAYING) {
        gameState = GAME_STATES.LEVEL_COMPLETE;
        document.getElementById('levelComplete').classList.add('show');
        document.getElementById('levelScore').textContent = `Score: ${player.score}`;
    }
}

function updateExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].life -= 15;
        if (explosions[i].life <= 0) {
            explosions.splice(i, 1);
        }
    }
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + (obj1.width || 3) > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + (obj1.height || 3) > obj2.y;
}

function updateStats() {
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('health').textContent = Math.max(0, player.health);
    document.getElementById('score').textContent = player.score;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid pattern for 8-bit feel
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw game objects
    drawPlayer();
    
    for (let enemy of enemies) {
        drawEnemy(enemy);
    }
    
    for (let bullet of bullets) {
        drawBullet(bullet);
    }
    
    for (let exp of explosions) {
        drawExplosion(exp);
    }

    // Draw level indicator
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px Arial';
    ctx.fillText(`LEVEL ${currentLevel}/${MAX_LEVELS} - ENEMIES: ${enemies.length}`, canvas.width - 250, 30);

    // Draw game over
    if (gameState === GAME_STATES.GAME_OVER) {
        document.getElementById('gameOver').classList.add('show');
        document.getElementById('finalScore').textContent = `Final Score: ${totalScore}`;
    }
}

function gameLoop() {
    if (gameState === GAME_STATES.PLAYING) {
        updatePlayer();
        updateBullets();
        updateEnemies();
        updateExplosions();
    }

    updateStats();
    draw();

    if (gameState !== GAME_STATES.MENU) {
        requestAnimationFrame(gameLoop);
    }
}

// Start menu on load
window.addEventListener('load', () => {
    draw();
});
