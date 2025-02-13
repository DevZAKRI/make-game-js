export class BombermanMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mapWidth = 20;
        this.mapHeight = 20;
        this.map = [];
        this.cells = [];
    }

    generateMap() {
        for (let y = 0; y < this.mapHeight; y++) {
            this.map[y] = []; 
            for (let x = 0; x < this.mapWidth; x++) {
                let cellType = 'empty';

                if (x === 0 || y === 0 || x === this.mapWidth - 1 || y === this.mapHeight - 1) {
                    cellType = 'wall';
                }
                else if (x % 2 === 0 && y % 2 === 0) {
                    cellType = 'wall';
                }
                else if (Math.random() < 0.3) {
                    cellType = 'block';
                }

                if ((x === 1 && y === 1) || (x === 1 && y === 2) || (x === 2 && y === 1)) {
                    cellType = 'empty';
                }

                this.map[y][x] = cellType; 
            }
        }

        this.render(); 
    }

    render() {
        const containerWidth = this.container.offsetWidth;
        const containerHeight = this.container.offsetHeight;
        const cellSize = Math.min(containerWidth / this.mapWidth, containerHeight / this.mapHeight);

        this.container.innerHTML = '';

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const cell = document.createElement('div');
                cell.className = `cell ${this.map[y][x]}`;
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                this.container.appendChild(cell);
                this.cells.push(cell);
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