

export class PowerUp {
    constructor() {
        this.x = Math.floor(Math.random() * 13);
        this.y = Math.floor(Math.random() * 13);
        this.type = ["health", "speed", "bombLimit", "killEnemy", "endKey"][Math.floor(Math.random() * 5)];
    }
}