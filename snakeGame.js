const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameInterval;
let snake;
let food;
let direction;
let gameOver = false;
let startMenu = document.getElementById("menu");
let startButton = document.getElementById("startBtn");

let score = 0; 

const tileSize = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function startGame() {
    gameOver = false;
    score = 0; 
    direction = "RIGHT";
    snake = [{ x: 100, y: 100 }];
    food = spawnFood();
    gameInterval = setInterval(updateGame, 100);
    startMenu.style.display = "none"; 
    canvas.style.display = "block"; 
}

function gameOverScreen() {
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 3, canvas.height / 3);
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width / 3, canvas.height / 2);

    startMenu.innerHTML = `
        <button id="restartBtn" class="button">Restart Game</button>
    `;

    document.getElementById("restartBtn").onclick = restartGame;
}

function restartGame() {
    startGame();
}

function spawnFood() {
    const x = Math.floor(Math.random() * (canvasWidth / tileSize)) * tileSize;
    const y = Math.floor(Math.random() * (canvasHeight / tileSize)) * tileSize;
    return { x, y };
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, tileSize, tileSize);
}

function updateSnakePosition() {
    const head = { ...snake[0] };
    
    switch (direction) {
        case "LEFT":
            head.x -= tileSize;
            break;
        case "RIGHT":
            head.x += tileSize;
            break;
        case "UP":
            head.y -= tileSize;
            break;
        case "DOWN":
            head.y += tileSize;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = spawnFood(); 
        score += 10; 
    } else {
        snake.pop(); 
    }
}

function checkCollision() {
    const head = snake[0];

    
    if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function updateGame() {
    updateSnakePosition();
    if (checkCollision()) {
        gameOverScreen();
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "DOWN") direction = "UP";
            break;
        case "ArrowDown":
            if (direction !== "UP") direction = "DOWN";
            break;
        case "ArrowLeft":
            if (direction !== "RIGHT") direction = "LEFT";
            break;
        case "ArrowRight":
            if (direction !== "LEFT") direction = "RIGHT";
            break;
    }
});

startButton.onclick = startGame;
