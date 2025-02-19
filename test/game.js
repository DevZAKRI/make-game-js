let lives = 3;
let Score = 0;
let gameTimer = 0;
let isPaused = false;
let isRespawn = false;
let isballMoving = false; // Controls whether the ball is moving
let timerInterval;

const config = {
    paddleSpeed: 10,
    ballSpeed: { x: 2, y: -2 },
    brickRows: 5,
    brickWidth: 50,
    colors: ['red', 'orange', 'yellow', 'green', 'blue']
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startGame);
});

function startGame() {
    document.getElementById('start-menu').remove();
    createGameUI();
    gameLoop();
}

function createGameUI() {
    document.body.innerHTML = `
        <div id="game-container">
            <div id="game-info">
                <span>Lives: <span id="lives">${lives}</span></span>
                <span>Score: <span id="score">${Score}</span></span>
                <span>Time: <span id="timer">0s</span></span>
                <button id="pause-button">Pause</button>
            </div>
            <div id="game-area">
                <div id="paddle"></div>
                <div id="ball"></div>
                <div id="bricks"></div>
            </div>
        </div>
    `;
    document.getElementById('pause-button').addEventListener('click', togglePause);
    generateBricks();
    setupControls();
    startTimer();
}

function generateBricks() {
    const brickArea = document.getElementById('bricks');
    brickArea.innerHTML = '';
    const numBricksPerRow = Math.floor(document.getElementById('game-area').clientWidth / config.brickWidth);
    brickArea.style.gridTemplateColumns = `repeat(${numBricksPerRow}, 1fr)`;

    for (let row = 0; row < config.brickRows; row++) {
        for (let col = 0; col < numBricksPerRow; col++) {
            const brick = document.createElement('div');
            brick.classList.add('brick');
            brick.style.backgroundColor = config.colors[row % config.colors.length];
            brick.dataset.hit = 'false';
            brickArea.appendChild(brick);
        }
    }
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') isRespawn = !isRespawn;
    });
}

function gameLoop() {
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const gameArea = document.getElementById('game-area');
    
    let ballSpeedX = config.ballSpeed.x;
    let ballSpeedY = config.ballSpeed.y;
    let moveLeft = false, moveRight = false;

    // Set initial ball position on top of the paddle
    resetBall();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLeft = true;
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRight = true;
        if (e.key === 'ArrowUp') isballMoving = true; // Start ball movement
    });
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLeft = false;
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRight = false;
    });

    function updateGame() {
        if (isPaused) return requestAnimationFrame(updateGame);

        // Paddle movement
        let newLeft = paddle.offsetLeft;
        if (moveLeft) newLeft -= config.paddleSpeed;
        if (moveRight) newLeft += config.paddleSpeed;
        newLeft = Math.max(0, Math.min(gameArea.clientWidth - paddle.clientWidth, newLeft));
        paddle.style.left = `${newLeft}px`;

        // Ball movement (only if isballMoving is true)
        if (isballMoving) {
            let ballLeft = ball.offsetLeft + ballSpeedX;
            let ballTop = ball.offsetTop + ballSpeedY;

            // Ball collision with walls
            if (ballLeft <= 0 || ballLeft + ball.clientWidth >= gameArea.clientWidth) ballSpeedX *= -1;
            if (ballTop <= 0) ballSpeedY *= -1;

            // Ball collision with paddle
            const paddleRect = paddle.getBoundingClientRect();
            const ballRect = ball.getBoundingClientRect();
            if (
                ballRect.bottom >= paddleRect.top &&
                ballRect.top < paddleRect.bottom &&
                ballRect.left < paddleRect.right &&
                ballRect.right > paddleRect.left
            ) {
                ballSpeedY *= -1.05;
            }

            // Ball collision with bricks
            const bricks = document.querySelectorAll('.brick');
            bricks.forEach(brick => {
                if (brick.dataset.hit === 'true') return;
                const brickRect = brick.getBoundingClientRect();
                if (
                    ballRect.bottom >= brickRect.top &&
                    ballRect.top < brickRect.bottom &&
                    ballRect.left < brickRect.right &&
                    ballRect.right > brickRect.left
                ) {
                    brick.dataset.hit = 'true';
                    brick.style.visibility = 'hidden';
                    ballSpeedY *= -1;
                    Score += 10; // Increase score
                    document.getElementById('score').textContent = Score; // Update score display
                }
            });

            // Ball out of bounds (lose life)
            if (ballTop + ball.clientHeight >= gameArea.clientHeight) {
                lives--;
                document.getElementById('lives').textContent = lives;
                if (lives <= 0) return endGame('Game Over!');
                resetBall();
            }

            // Update ball position
            ball.style.left = `${ballLeft}px`;
            ball.style.top = `${ballTop}px`;
        } else {
            // Keep the ball on top of the paddle
            ball.style.left = `${paddle.offsetLeft + (paddle.clientWidth - ball.clientWidth) / 2}px`;
            ball.style.top = `${paddle.offsetTop - ball.clientHeight}px`;
        }

        requestAnimationFrame(updateGame);
    }

    function resetBall() {
        isballMoving = false; // Stop ball movement
        ball.style.left = `${paddle.offsetLeft + (paddle.clientWidth - ball.clientWidth) / 2}px`;
        ball.style.top = `${paddle.offsetTop - ball.clientHeight}px`;
        ballSpeedX = config.ballSpeed.x;
        ballSpeedY = config.ballSpeed.y;
    }

    updateGame();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!isPaused) {
            gameTimer++;
            document.getElementById('timer').textContent = `${gameTimer}s`;
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pause-button').textContent = isPaused ? 'Resume' : 'Pause';
}

function endGame(message) {
    clearInterval(timerInterval);
    document.body.innerHTML = `<h2>${message}</h2><button onclick="location.reload()">Restart</button>`;
}