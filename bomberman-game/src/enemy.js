

export class Enemy {
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