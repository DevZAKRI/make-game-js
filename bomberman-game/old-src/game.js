import { Player } from "./player.js";
import { BombermanMap } from "./map.js";
import { Enemy } from "./enemy.js";
import { PowerUp } from "./powerUp.js";

export class Game {
    constructor(containerId) {
        this.gameRunning = false;
        this.timer = 0;
        this.score = 0;
        this.lives = 3;
        this.fps = 0;
        this.lastFrameTime = 0;
        this.container = document.getElementById(containerId);
        this.gameMap = new BombermanMap("game-container", this);
        this.player = new Player(1, 1, this);
        this.enemies = [];
        this.bombs = [];
        this.powerUps = [];
        this.paused = false;
        this.canPlaceBomb = true;
        this.bombLimit = 1;
        this.level = 1;
        this.endKeyCollected = false;

        document.getElementById("pause-btn").addEventListener("click", () => this.pause());
        document.getElementById("resume-btn").addEventListener("click", () => this.resume());
        document.getElementById("restart-btn").addEventListener("click", () => this.restart());
    }

    start() {
        document.getElementById("start-menu").style.display = "none";
        document.getElementById("scoreboard").style.display = "flex";
        this.gameMap.generateMap();
        this.spawnEnemies(3);
        this.spawnPowerUps(5);
        this.gameRunning = true;
        this.paused = false;
        this.timer = 0;
        this.lastFrameTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    pause() {
        this.paused = true;
        document.getElementById("pause-menu").style.display = "block";
    }

    resume() {
        document.getElementById("pause-menu").style.display = "none";
        this.paused = false;
        this.lastFrameTime = performance.now();
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    restart() {
        location.reload();
    }

    gameLoop(timestamp) {
        if (this.paused || !this.gameRunning) return;

        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.timer += deltaTime / 1000; 
        this.updateGameObjects();
        this.checkGameOver();

        if (deltaTime >= 1000 / 60) {
            this.updateScoreboard();
            this.gameMap.render();
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    updateScoreboard() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = Math.floor(this.timer % 60);
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById("timer").textContent = formattedTime;

        document.getElementById("score").textContent = this.score;
        document.getElementById("lives").textContent = this.lives;
        document.getElementById("fps").textContent = Math.round(this.fps);
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

    applyPowerUp(powerUp) {
        switch (powerUp.type) {
            case "health":
                this.lives++;
                break;
            case "speed":
                this.player.speed += 0.1;
                break;
            case "bombLimit":
                this.bombLimit++;
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
        if (this.timer >= 180) {
            this.gameOver("Time's up! You didn't complete the level in time.");
        } else if (this.lives <= 0) {
            this.gameOver("Game Over! You ran out of lives.");
        } else if (this.endKeyCollected && this.enemies.length === 0) {
            this.nextLevel();
        }
    }

    gameOver(message) {
        this.gameRunning = false;
        alert(`${message} Your score: ${this.score}`);
        this.restart();
    }

    nextLevel() {
        this.level++;
        this.endKeyCollected = false;
        this.timer = 0;
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
        this.powerUps = this.powerUps.filter(powerUp => {
            if (powerUp.x === this.player.x && powerUp.y === this.player.y) {
                this.applyPowerUp(powerUp);
                return false; 
            }
            return true;
        });
    }
}

export const game = new Game("game-container");
document.getElementById("start-btn").addEventListener("click", () => game.start());