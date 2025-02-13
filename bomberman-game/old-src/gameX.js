class Game {
    constructor(containerId) {
        this.gameRunning = false;
        this.timer = 0;
        this.score = 0;
        this.lives = 3;
        this.fps = 0;
        this.lastFrameTime = performance.now();
        this.container = document.getElementById(containerId);
        this.gameMap = new BombermanMap("game-container");
        this.player = new Player(1, 1, this);
        this.enemies = [];
        this.bombs = [];
        this.powerUps = [];
        this.paused = false;
        this.canPlaceBomb = true;
        this.bombLimit = 1;
        this.level = 1;
        this.endKeyCollected = false;
    }

    start() {
        document.getElementById("start-menu").style.display = "none";
        document.getElementById("scoreboard").style.display = "flex";
        this.gameMap.generateMap();
        this.spawnEnemies(3);
        this.spawnPowerUps(5);
        this.gameRunning = true;
        this.paused = false;
        requestAnimationFrame(() => this.gameLoop());
    }

    pause() {
        this.paused = true;
        document.getElementById("pause-menu").style.display = "block";
    }

    resume() {
        document.getElementById("pause-menu").style.display = "none";
        this.paused = false;
        requestAnimationFrame(() => this.gameLoop());
    }

    restart() {
        location.reload();
    }

    gameLoop() {
        if (this.paused) return;
        let now = performance.now();
        this.fps = Math.round(1000 / (now - this.lastFrameTime));
        this.lastFrameTime = now;
        
        if (this.gameRunning) {
            this.timer++;
            this.updateScoreboard();
            this.updateGameObjects();
            this.checkGameOver();
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    updateScoreboard() {
        document.getElementById("timer").textContent = this.timer;
        document.getElementById("score").textContent = this.score;
        document.getElementById("lives").textContent = this.lives;
        document.getElementById("fps").textContent = this.fps;
        document.getElementById("level").textContent = this.level;
    }

    updateGameObjects() {
        if (!this.paused) {
            this.player.move();
            this.bombs.forEach(bomb => bomb.update());
            this.enemies.forEach(enemy => enemy.move());
            this.checkPlayerCollisionWithEnemies();
            this.checkPlayerCollisionWithPowerUps();
        }
    }

    checkPlayerCollisionWithEnemies() {
        this.enemies.forEach(enemy => {
            if (enemy.x === this.player.x && enemy.y === this.player.y) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    this.player.respawn();
                }
            }
        });
    }

    checkPlayerCollisionWithPowerUps() {
        this.powerUps.forEach((powerUp, index) => {
            if (powerUp.x === this.player.x && powerUp.y === this.player.y) {
                this.applyPowerUp(powerUp);
                this.powerUps.splice(index, 1);
            }
        });
    }

    applyPowerUp(powerUp) {
        switch (powerUp.type) {
            case "health":
                this.lives++;
                break;
            case "speed":
                this.player.speed++;
                break;
            case "killEnemy":
                this.enemies = [];
                break;
            case "endKey":
                this.endKeyCollected = true;
                break;
        }
    }

    checkGameOver() {
        if (this.lives <= 0) {
            this.gameOver();
        } else if (this.endKeyCollected && this.enemies.length === 0) {
            this.nextLevel();
        }
    }

    gameOver() {
        this.gameRunning = false;
        alert("Game Over! Your score: " + this.score);
        this.restart();
    }

    nextLevel() {
        this.level++;
        this.endKeyCollected = false;
        this.gameMap.generateMap();
        this.spawnEnemies(3 + this.level);
        this.spawnPowerUps(5);
        this.player.respawn();
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            this.enemies.push(new Enemy(this));
        }
    }

    spawnPowerUps(count) {
        for (let i = 0; i < count; i++) {
            this.powerUps.push(new PowerUp());
        }
    }
}

class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.speed = 1;
        document.addEventListener("keydown", (e) => this.handleMovement(e));
    }

    handleMovement(event) {
        if (this.game.paused) return;
        switch (event.key) {
            case "ArrowUp": this.move(0, -1); break;
            case "ArrowDown": this.move(0, 1); break;
            case "ArrowLeft": this.move(-1, 0); break;
            case "ArrowRight": this.move(1, 0); break;
            case " ": this.placeBomb(); break;
            case "Escape": this.game.pause(); break;
        }
    }

    move(dx, dy) {
        let newX = this.x + dx * this.speed;
        let newY = this.y + dy * this.speed;
        if (!BombermanMap.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
            this.game.gameMap.render(); // Update the game map to reflect the player's new position
        }
    }

    placeBomb() {
        if (this.game.canPlaceBomb && this.game.bombs.length < this.game.bombLimit) {
            this.game.bombs.push(new Bomb(this.x, this.y, this.game));
            this.game.canPlaceBomb = false;
        }
    }

    respawn() {
        this.x = 1;
        this.y = 1;
        this.game.gameMap.render(); // Update the game map to reflect the player's respawn position
    }
}

class Bomb {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.timer = 3;
        this.exploding = false;
        this.interval = setInterval(() => this.tick(), 1000);
    }

    tick() {
        if (this.game.paused) return;
        this.timer--;
        if (this.timer <= 0) {
            this.explode();
        }
    }

    explode() {
        clearInterval(this.interval);
        this.exploding = true;
        this.game.enemies = this.game.enemies.filter(enemy => !this.isEnemyHit(enemy));
        this.game.canPlaceBomb = true;
        this.game.score += this.game.enemies.length * 10;
        this.game.gameMap.destroyBlocks(this.x, this.y);
        this.game.bombs = this.game.bombs.filter(bomb => bomb !== this);
    }

    isEnemyHit(enemy) {
        return Math.abs(enemy.x - this.x) <= 2 && Math.abs(enemy.y - this.y) <= 2;
    }
}

class Enemy {
    constructor(game) {
        this.x = Math.floor(Math.random() * 13);
        this.y = Math.floor(Math.random() * 13);
        this.game = game;
    }

    move() {
        if (this.game.paused) return;
        let direction = Math.floor(Math.random() * 4);
        switch (direction) {
            case 0: this.y--; break;
            case 1: this.y++; break;
            case 2: this.x--; break;
            case 3: this.x++; break;
        }
    }
}

class PowerUp {
    constructor() {
        this.x = Math.floor(Math.random() * 13);
        this.y = Math.floor(Math.random() * 13);
        this.type = ["health", "speed", "killEnemy", "endKey"][Math.floor(Math.random() * 4)];
    }
}

class BombermanMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mapWidth = 13;
        this.mapHeight = 13;
        this.map = [];
        this.level = 1;
    }

    class BombermanMap {
        constructor(containerId, game) {
            this.container = document.getElementById(containerId);
            this.game = game;
            this.mapWidth = 13; // Map width
            this.mapHeight = 13; // Map height
            this.map = [];
        }
    
        generateMap() {
            // Initialize the map with empty spaces
            for (let y = 0; y < this.mapHeight; y++) {
                this.map[y] = [];
                for (let x = 0; x < this.mapWidth; x++) {
                    this.map[y][x] = 'empty';
                }
            }
    
            // Add border walls
            for (let y = 0; y < this.mapHeight; y++) {
                for (let x = 0; x < this.mapWidth; x++) {
                    if (x === 0 || y === 0 || x === this.mapWidth - 1 || y === this.mapHeight - 1) {
                        this.map[y][x] = 'wall'; // Border walls
                    }
                }
            }
    
            // Add inner walls and breakable blocks
            for (let y = 1; y < this.mapHeight - 1; y++) {
                for (let x = 1; x < this.mapWidth - 1; x++) {
                    if (x % 2 === 0 && y % 2 === 0) {
                        this.map[y][x] = 'wall'; // Inner walls (checkerboard pattern)
                    } else if (Math.random() < 0.3 && this.map[y][x] === 'empty') {
                        this.map[y][x] = 'block'; // Random breakable blocks
                    }
                }
            }
    
            // Ensure the player's starting position is clear
            this.map[1][1] = 'empty'; // Player spawn point
            this.map[1][2] = 'empty'; // Clear adjacent tiles for movement
            this.map[2][1] = 'empty';
    
            // Render the map
            this.render();
        }
    
        render() {
            this.container.innerHTML = '';
            const containerWidth = this.container.offsetWidth;
            const containerHeight = this.container.offsetHeight;
            const cellSize = Math.min(containerWidth / this.mapWidth, containerHeight / this.mapHeight);
    
            for (let y = 0; y < this.mapHeight; y++) {
                for (let x = 0; x < this.mapWidth; x++) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell', this.map[y][x]);
    
                    // Highlight the player's position
                    if (x === this.game.player.x && y === this.game.player.y) {
                        cell.classList.add('player');
                    }
    
                    cell.style.width = `${cellSize}px`;
                    cell.style.height = `${cellSize}px`;
                    this.container.appendChild(cell);
                }
            }
        }
    
        static isWall(x, y) {
            return game.gameMap.map[y] && game.gameMap.map[y][x] === 'wall';
        }
    
        destroyBlocks(x, y) {
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    if (this.map[y + dy] && this.map[y + dy][x + dx] === 'block') {
                        this.map[y + dy][x + dx] = 'empty'; // Destroy breakable blocks
                    }
                }
            }
            this.render(); // Re-render the map after destruction
        }
    }
    spawnEnemies(count) {
        let spawned = 0;
        while (spawned < count) {
            let x = Math.floor(Math.random() * 11) + 1;
            let y = Math.floor(Math.random() * 11) + 1;
            if (this.map[y][x] === 'empty') {
                this.map[y][x] = 'enemy';
                spawned++;
            }
        }
    }
}

const game = new Game("game-container");
document.getElementById("start-btn").addEventListener("click", () => game.start());
document.getElementById("pause-btn").addEventListener("click", () => game.pause());
document.getElementById("resume-btn").addEventListener("click", () => game.resume());
document.getElementById("restart-btn").addEventListener("click", () => game.restart());