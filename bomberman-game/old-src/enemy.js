import { BombermanMap } from "./map.js";

export class Enemy {
    constructor(game) {
        this.x = Math.floor(Math.random() * 18) + 1;
        this.y = Math.floor(Math.random() * 18) + 1;
        this.game = game;
        this.speed = 0.05; 
        this.moveCounter = 0;
    }

    move() {
        if (this.game.paused) return;

        this.moveCounter += this.speed;
        if (this.moveCounter < 1) return; // Only move when counter reaches 1
        this.moveCounter = 0; // Reset counter

        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 }   // Right
        ];

        const validDirections = directions.filter(dir => {
            const newX = this.x + dir.dx;
            const newY = this.y + dir.dy;

            // Check if the new cell is within bounds and empty
            return (
                newX >= 0 &&
                newX < this.game.gameMap.mapWidth &&
                newY >= 0 &&
                newY < this.game.gameMap.mapHeight &&
                this.game.gameMap.map[newY][newX] === 'empty'
            );
        });

        if (validDirections.length > 0) {
            const direction = validDirections[Math.floor(Math.random() * validDirections.length)];
            this.x += direction.dx;
            this.y += direction.dy;
        }
    }
}