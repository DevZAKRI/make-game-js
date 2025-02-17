

class Paddle {
    constructor(gameContainer) {
        this.gameContainer = gameContainer;
        this.width = 100;
        this.height = 20;
        this.position = {
            x: (gameContainer.offsetWidth - this.width) / 2,
            y: gameContainer.offsetHeight - this.height - 10
        };
        this.element = this.createPaddleElement();
    }

    createPaddleElement() {
        const paddle = document.getElementById('paddle');
        // paddle.style.width = `${this.width}px`;
        // paddle.style.height = `${this.height}px`;
        // paddle.style.position = 'absolute';
        // paddle.style.backgroundColor = 'blue';
        paddle.style.left = `${this.position.x}px`;
        paddle.style.top = `${this.position.y}px`;
        this.gameContainer.appendChild(paddle);
        return paddle;
    }

    move(x) {
        this.position.x = x;
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x > this.gameContainer.offsetWidth - this.width) {
            this.position.x = this.gameContainer.offsetWidth - this.width;
        }
        this.element.style.left = `${this.position.x}px`;
    }
}

export default Paddle;