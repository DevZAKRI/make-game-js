export class Bomb {
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