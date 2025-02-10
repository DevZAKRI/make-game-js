
import { game } from "./game.js";

export class BombermanMap {
    constructor(containerId, game) {
        this.container = document.getElementById(containerId);
        this.game = game;
        this.mapWidth = 15;
        this.mapHeight = 13;
        this.map = [];
    }

    generateMap() {
        
        for (let y = 0; y < this.mapHeight; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.mapWidth; x++) {
                this.map[y][x] = 'empty';
            }
        }

      
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (x === 0 || y === 0 || x === this.mapWidth - 1 || y === this.mapHeight - 1) {
                    this.map[y][x] = 'wall';
                }
            }
        }

      
        for (let y = 1; y < this.mapHeight - 1; y++) {
            for (let x = 1; x < this.mapWidth - 1; x++) {
                if (x % 2 === 0 && y % 2 === 0) {
                    this.map[y][x] = 'wall';
                } else if (Math.random() < 0.3 && this.map[y][x] === 'empty') {
                    this.map[y][x] = 'block';
                }
            }
        }

        this.map[1][1] = 'empty';
        this.map[1][2] = 'empty';
        this.map[2][1] = 'empty';

        
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

                if (x === this.game.player.x && y === this.game.player.y) {
                    cell.classList.add('player');
                    cell.style.transform = `translate(${this.game.player.subX * 100}%, ${this.game.player.subY * 100}%)`;
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
                    this.map[y + dy][x + dx] = 'empty';
                }
            }
        }
        this.render();
    }
}