const startMenu = document.getElementById('start-menu');
const gameContainer = document.getElementById('game-area');
const gameOverScreen = document.getElementById('game-over');
const winScreen = document.getElementById('win-screen');
const pauseMenu = document.getElementById('pause-menu');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const winRestartButton = document.getElementById('win-restart-button');
const pauseButton = document.getElementById('pause-button');
const continueButton = document.getElementById('continue-button');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const bricksContainer = document.getElementById('bricks');

let lives = 3;
let time = 0;
let timerInterval;
let ballX = 390;
let ballY = 290;
let ballSpeedX = 2;
let ballSpeedY = -2;
let paddleX = 350;
let gameStarted = false;
let gamePaused = false;

const brickRowCount = 5;
const brickColumnCount = 10;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];

function createBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            const brick = document.createElement('div');
            brick.classList.add('brick');
            brick.style.left = `${c * (brickWidth + brickPadding) + brickOffsetLeft}px`;
            brick.style.top = `${r * (brickHeight + brickPadding) + brickOffsetTop}px`;
            bricksContainer.appendChild(brick);
            bricks[c][r] = { element: brick, status: 1 };
        }
    }
}

function resetGame() {
    lives = 3;
    time = 0;
    ballX = 390;
    ballY = 290;
    ballSpeedX = 2;
    ballSpeedY = -2;
    paddleX = 350;
    gameStarted = false;
    gamePaused = false;
    livesDisplay.textContent = lives;
    timerDisplay.textContent = time;
    bricksContainer.innerHTML = '';
    createBricks();
    gameContainer.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    winScreen.classList.add('hidden');
    startMenu.classList.add('hidden');
    pauseMenu.classList.add('hidden');
}

function updatePaddle(event) {
    const rect = gameContainer.getBoundingClientRect();
    paddleX = event.clientX - rect.left - paddle.offsetWidth / 2;
    if (paddleX < 0) paddleX = 0;
    if (paddleX > gameContainer.offsetWidth - paddle.offsetWidth) paddleX = gameContainer.offsetWidth - paddle.offsetWidth;
    paddle.style.left = `${paddleX}px`;
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0 || ballX > 780) ballSpeedX = -ballSpeedX;
    if (ballY < 0) ballSpeedY = -ballSpeedY;

    if (ballY > 560 && ballX > paddleX && ballX < paddleX + 100) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with bricks
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];
            if (brick.status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                if (ballX > brickX && ballX < brickX + brickWidth && ballY > brickY && ballY < brickY + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = 0;
                    brick.element.classList.add('hidden');
                    checkWin();
                }
            }
        }
    }

    // Ball out of bounds
    if (ballY > 600) {
        lives--;
        livesDisplay.textContent = lives;
        if (lives === 0) {
            gameOver();
        } else {
            resetBall();
        }
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function resetBall() {
    ballX = 390;
    ballY = 290;
    ballSpeedX = 4;
    ballSpeedY = -4;
}

function checkWin() {
    let allBricksDestroyed = true;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                allBricksDestroyed = false;
                break;
            }
        }
    }
    if (allBricksDestroyed) {
        winGame();
    }
}

function gameOver() {
    clearInterval(timerInterval);
    gameContainer.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
}

function winGame() {
    clearInterval(timerInterval);
    gameContainer.classList.add('hidden');
    winScreen.classList.remove('hidden');
}

function updateTimer() {
    time++;
    timerDisplay.textContent = time;
}

startButton.addEventListener('click', () => {
    resetGame();
    gameStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
    gameContainer.addEventListener('mousemove', updatePaddle);
    requestAnimationFrame(gameLoop);
});

restartButton.addEventListener('click', resetGame);
winRestartButton.addEventListener('click', resetGame);
pauseButton.addEventListener('click', togglePause);
continueButton.addEventListener('click', togglePause);

function togglePause() {
    if (gamePaused) {
        gamePaused = false;
        pauseMenu.classList.add('hidden');
        timerInterval = setInterval(updateTimer, 1000);
        gameContainer.addEventListener('mousemove', updatePaddle);
        requestAnimationFrame(gameLoop);
    } else {
        gamePaused = true;
        pauseMenu.classList.remove('hidden');
        clearInterval(timerInterval);
        gameContainer.removeEventListener('mousemove', updatePaddle);
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
        togglePause();
    }
});

function gameLoop() {
    if (gameStarted && !gamePaused) {
        updateBall();
    }
    requestAnimationFrame(gameLoop);
}

createBricks();
gameLoop();