import { BombermanMap } from "./map.js";
import { Bomb } from "./bomb.js";

export class Player {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.subX = 0;
        this.subY = 0;
        this.game = game;
        this.speed = 0.2;
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
        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!BombermanMap.isWall(newX, newY)) {
            this.x = newX;
            this.y = newY;
            this.game.gameMap.render();
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
        this.game.gameMap.render();
    }
}