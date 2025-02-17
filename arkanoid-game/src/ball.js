class Ball {
    constructor(x, y, speedX, speedY) {
        this.x = x; // Ball's horizontal position
        this.y = y; // Ball's vertical position
        this.speedX = speedX; // Ball's horizontal speed
        this.speedY = speedY; // Ball's vertical speed
    }

    update() {
        this.x += this.speedX; // Update ball's position based on speed
        this.y += this.speedY; // Update ball's position based on speed
    }

    reset() {
        this.x = 390; // Reset ball's position to center
        this.y = 290; // Reset ball's position to center
        this.speedX = 2; // Reset horizontal speed
        this.speedY = -2; // Reset vertical speed
    }

    handleCollisionWithPaddle(paddle) {
        // Logic to handle collision with paddle
    }

    handleCollisionWithBricks(bricks) {
        // Logic to handle collision with bricks
    }
}

export default Ball;