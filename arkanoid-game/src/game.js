let currentLevel = 1;
let lives = 3;

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
    livesValue.textContent = lives;
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

    generateBricks(currentLevel);
}


function generateBricks(level) {
    const brickArea = document.getElementById('bricks');
    const gameArea = document.getElementById('game-area');
    brickArea.innerHTML = '';

    const brickWidth = gameArea.offsetWidth / 10;
    const brickHeight = 30;
    const numBricksPerRow = Math.floor(gameArea.offsetWidth / brickWidth);
    const numRows = 5;
    const colors = ['red', 'orange', 'yellow', 'green', 'blue']

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numBricksPerRow; col++) {
            const brick = document.createElement('div');
            brick.classList.add('brick');
            brick.style.width = `${brickWidth}px`;
            brick.style.height = `${brickHeight}px`;
            brick.style.left = `${col * brickWidth}px`;
            brick.style.top = `${row * brickHeight}px`;
            brick.style.backgroundColor = colors[row % colors.length]
            brick.setAttribute('data-hit', 'false');
            brickArea.appendChild(brick);
        }
    }
}

function gameStart() {
    const gameArea = document.getElementById('game-area');
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const livesValue = document.getElementById('lives');

    let paddleSpeed = 10;
    let moveLeft = false;
    let moveRight = false;

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = true;
        if (event.key === 'ArrowRight' || event.key === 'd') moveRight = true;
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = false;
        if (event.key === 'ArrowRight' || event.key === 'd') moveRight = false;
    });

    function movePaddle() {
        const gameAreaRect = gameArea.getBoundingClientRect();
        const paddleWidth = paddle.offsetWidth;
        let newLeft = paddle.offsetLeft

        if (moveLeft) {
            newLeft -= paddleSpeed;
        } 
        if (moveRight) {
            newLeft += paddleSpeed;
        }

        newLeft = Math.max(0, Math.min(gameAreaRect.width - paddleWidth, newLeft));

        paddle.style.left = `${newLeft}px`;
        requestAnimationFrame(movePaddle);
    }

    movePaddle();

    let ballSpeedX = 2;
    let ballSpeedY = 2;

    function moveBall() {
        const ballRect = ball.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();
        const paddleRect = paddle.getBoundingClientRect();
        const bricks = document.querySelectorAll('.brick');

        let newLeft = parseFloat(ball.style.left || gameAreaRect.width / 2);
        let newTop = parseFloat(ball.style.top || gameAreaRect.height / 2);

        if (newLeft <= 0 || newLeft + ballRect.width >= gameAreaRect.width) {
            ballSpeedX *= -1;
        }

        if (newTop <= 0) {
            ballSpeedY *= -1;
        }

        if (
            ballRect.bottom >= paddleRect.top &&
            ballRect.top < paddleRect.bottom &&
            ballRect.left < paddleRect.right &&
            ballRect.right > paddleRect.left
        ) {
            ballSpeedY *= -1;
        }

        bricks.forEach(brick => {
            const brickRect = brick.getBoundingClientRect();
            if (
                ballRect.bottom >= brickRect.top &&
                ballRect.top < brickRect.bottom &&
                ballRect.left < brickRect.right &&
                ballRect.right > brickRect.left &&
                brick.getAttribute('data-hit') === 'false'
            ) {
                brick.setAttribute('data-hit', 'true');
                brick.style.visibility = 'hidden';
                ballSpeedY *= -1;
            }
        });

        if (newTop + ballRect.height >= gameAreaRect.height) {
            lives--;
            livesValue.textContent = lives;
            if (lives <= 0) {
                alert('Game Over!');
                return;
            }
            resetBall();
        }

        ball.style.left = `${newLeft + ballSpeedX}px`;
        ball.style.top = `${newTop + ballSpeedY}px`;

        requestAnimationFrame(moveBall);
    }

    function resetBall() {
        ball.style.left = `${gameArea.offsetWidth / 2}px`;
        ball.style.top = `${gameArea.offsetHeight / 2}px`;
        ballSpeedY = -2;
    }
    

    moveBall();
}
