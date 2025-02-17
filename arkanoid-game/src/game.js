let currentLevel = 1;
let lives = 3

document.addEventListener('DOMContentLoaded', () => {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', () => {
        createGameUI();
        gameStart();
        startMenu.remove();
    });
});

function createGameUI() {
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';

    const gameInfo = document.createElement('div');
    gameInfo.id = 'game-info';

    const livesSpan = document.createElement('span');
    livesSpan.textContent = 'Lives: ';
    const livesValue = document.createElement('span');
    livesValue.id = 'lives';
    livesValue.textContent = '3';
    livesSpan.appendChild(livesValue);

    const timerSpan = document.createElement('span');
    timerSpan.textContent = 'Time: ';
    const timerValue = document.createElement('span');
    timerValue.id = 'timer';
    timerValue.textContent = '0';
    timerSpan.appendChild(timerValue);
    timerSpan.appendChild(document.createTextNode('s'));

    const pauseButton = document.createElement('button');
    pauseButton.id = 'pause-button';
    pauseButton.textContent = 'Pause';

    gameInfo.appendChild(livesSpan);
    gameInfo.appendChild(timerSpan);
    gameInfo.appendChild(pauseButton);

    const gameArea = document.createElement('div');
    gameArea.id = 'game-area';

    const paddle = document.createElement('div');
    paddle.id = 'paddle';

    const ball = document.createElement('div');
    ball.id = 'ball';

    const bricks = document.createElement('div');
    bricks.id = 'bricks';

    gameArea.appendChild(paddle);
    gameArea.appendChild(ball);
    gameArea.appendChild(bricks);

    gameContainer.appendChild(gameInfo);
    gameContainer.appendChild(gameArea);

    document.body.appendChild(gameContainer);

    function generateBricks(level) {
        const brickArea = document.getElementById('bricks');
        const brickWidth = gameArea.offsetWidth / 10;
        const brickHeight = 30; 
        const numBricksPerRow = Math.floor(gameArea.offsetWidth / brickWidth);
        const numRows = 5; 
        const totalWidth = numBricksPerRow * brickWidth; 
        const totalHeight = numRows * brickHeight;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numBricksPerRow; col++) {
                const brick = document.createElement('div');
                brick.classList.add('brick');
                brick.style.width = `${brickWidth}px`;
                brick.style.height = `${brickHeight}px`;
                brickArea.appendChild(brick);
            }
        }
    }

    generateBricks(currentLevel);
}

function gameStart() {
    const gameArea = document.getElementById('game-area');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');

    let paddleSpeed = 5;
    let moveLeft = false;
    let moveRight = false;

    // Listen for key presses
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            moveLeft = true;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            moveRight = true;
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            moveLeft = false;
        } else if (event.key === 'ArrowRight' || event.key === 'd') {
            moveRight = false;
        }
    });

    function movePaddle() {
        const gameAreaRect = gameArea.getBoundingClientRect();
        const paddleWidth = paddle.offsetWidth;
        let newLeft = paddle.offsetLeft;

        if (moveLeft) {
            newLeft -= paddleSpeed;
        }
        if (moveRight) {
            newLeft += paddleSpeed;
        }

        newLeft = Math.max(paddleWidth / 2 + 1, Math.min(gameAreaRect.width - paddleWidth / 2 - 1, newLeft));

        paddle.style.left = `${newLeft}px`;

        requestAnimationFrame(movePaddle);
    }

    movePaddle();

    let ballSpeedX = 0.5;
    let ballSpeedY = 0.5;

    function moveBall() {
        const livesValue = document.getElementById('lives')
        const ballRect = ball.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();

        let newLeft = ball.offsetLeft + ballSpeedX;
        let newTop = ball.offsetTop + ballSpeedY;

        if (newLeft <= 0) {
            ballSpeedX *= -1;
            newLeft = ball.offsetWidth / 2;
        }

        if (newLeft + ballRect.width >= gameAreaRect.width) {
            ballSpeedX *= -1;
            newLeft = gameAreaRect.width - ballRect.width;
        }

        if (newTop <= 0) {
            ballSpeedY *= -1;
            newTop = ball.offsetHeight / 2
        }
       
        if (
            ballRect.bottom >= paddleRect.top &&
            ballRect.left < paddleRect.right &&
            ballRect.right > paddleRect.left
        ) {
            ballSpeedY = -Math.abs(ballSpeedY);
        }

        const bricksArray = document.querySelectorAll('.brick');
        bricksArray.forEach(brick => {
            const brickRect = brick.getBoundingClientRect();
            if (
                ballRect.bottom >= brickRect.top &&
                ballRect.left < brickRect.right &&
                ballRect.right > brickRect.left &&
                brick.getAttribute('data-hit') === 'false'
            ) {
                console.log('a Brick hit')
                ballSpeedY *= -1; 
                brick.setAttribute('data-hit', 'true'); 
                brick.style.display = 'none'; 
            }
        });

        if (newTop + ballRect.height >= gameAreaRect.height) {
            console.log("Ball missed the paddle! Resetting...");
            lives--;
            livesValue.textContent = lives;
            newLeft = gameAreaRect.width / 2 - ballRect.width / 2;
            newTop = gameAreaRect.height / 2 - ballRect.height / 2;
            ballSpeedY = -3;

            if (lives <= 0) {
                alert("Game Over!");
                return;
            }
        }


        ball.style.left = `${newLeft}px`;
        ball.style.top = `${newTop}px`;

        requestAnimationFrame(moveBall);
    }

    moveBall();
}
