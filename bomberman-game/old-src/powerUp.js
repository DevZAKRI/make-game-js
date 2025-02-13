export class PowerUp {
    constructor() {
        this.x = Math.floor(Math.random() * 18) + 1;
        this.y = Math.floor(Math.random() * 18) + 1;
        this.type = ["health", "speed", "bombLimit", "killEnemy", "endKey"][Math.floor(Math.random() * 5)];
    }
}