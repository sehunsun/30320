const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const statusDisplay = document.getElementById("status");

const BLOCK_SIZE = 20;
const MAP_SIZE = 20;
canvas.width = MAP_SIZE * BLOCK_SIZE;
canvas.height = MAP_SIZE * BLOCK_SIZE;

let gameTimer = null;
let speed = 150;
let score = 0;
let invincible = false; // 是否擁有保命
let speedBoost = false; // 是否加速中

// === 背景（漸層） ===
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#003300");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// === 通用蘋果類 ===
class Apple {
  constructor(color, effect) {
    this.x = Math.floor(Math.random() * MAP_SIZE);
    this.y = Math.floor(Math.random() * MAP_SIZE);
    this.color = color;
    this.effect = effect;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * BLOCK_SIZE, this.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  }

  reposition() {
    this.x = Math.floor(Math.random() * MAP_SIZE);
    this.y = Math.floor(Math.random() * MAP_SIZE);
  }
}

// === 三種蘋果 ===
const redApple = new Apple("red", "grow");
const goldApple = new Apple("gold", "shield");
const blueApple = new Apple("cyan", "speed");

// === 蛇 ===
const snake = {
  body: [{ x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) }],
  size: 5,
  direction: { x: 0, y: -1 },

  drawSnake: function () {
    this.moveSnake();
    ctx.fillStyle = "lime";
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillRect(
        this.body[i].x * BLOCK_SIZE,
        this.body[i].y * BLOCK_SIZE,
        BLOCK_SIZE - 1,
        BLOCK_SIZE - 1
      );
    }
  },

  moveSnake: function () {
    const newBlock = {
      x: this.body[0].x + this.direction.x,
      y: this.body[0].y + this.direction.y
    };

    // 撞牆或撞自己
    const hitWall = newBlock.x < 0 || newBlock.x >= MAP_SIZE || newBlock.y < 0 || newBlock.y >= MAP_SIZE;
    const hitSelf = this.body.some(b => b.x === newBlock.x && b.y === newBlock.y);

    if (hitWall || hitSelf) {
      if (invincible) {
        invincible = false; // 消耗保命
        updateStatus("🟡 保命已使用！");
      } else {
        endGame();
        return;
      }
    }

    this.body.unshift(newBlock);

    // 吃到不同道具
    if (newBlock.x === redApple.x && newBlock.y === redApple.y) {
      this.size++;
      score++;
      redApple.reposition();
    }
    else if (newBlock.x === goldApple.x && newBlock.y === goldApple.y) {
      invincible = true;
      goldApple.reposition();
      updateStatus("🟡 你獲得了保命機會！");
    }
    else if (newBlock.x === blueApple.x && newBlock.y === blueApple.y) {
      if (!speedBoost) {
        speedBoost = true;
        updateStatus("🔵 加速中！");
        clearInterval(gameTimer);
        gameTimer = setInterval(gameLoop, 80);
        setTimeout(() => {
          speedBoost = false;
          updateStatus("");
          clearInterval(gameTimer);
          gameTimer = setInterval(gameLoop, speed);
        }, 5000);
      }
      blueApple.reposition();
    }

    while (this.body.length > this.size) {
      this.body.pop();
    }
  },
};

// === 控制 ===
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (snake.direction.y !== 1) snake.direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (snake.direction.y !== -1) snake.direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (snake.direction.x !== 1) snake.direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (snake.direction.x !== -1) snake.direction = { x: 1, y: 0 };
      break;
  }
});

// === 主遊戲迴圈 ===
function gameLoop() {
  drawBackground();
  redApple.draw();
  goldApple.draw();
  blueApple.draw();
  snake.drawSnake();
  updateScore();
}

// === 分數 / 狀態 ===
function updateScore() {
  scoreDisplay.textContent = `分數：${score}`;
}

function updateStatus(text) {
  statusDisplay.textContent = text;
}

// === 結束遊戲 ===
function endGame() {
  clearInterval(gameTimer);
  canvas.style.display = "none";
  scoreDisplay.style.display = "none";
  statusDisplay.style.display = "none";
  gameOverScreen.style.display = "block";
}

// === 開始遊戲 ===
function startGame() {
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
  canvas.style.display = "block";
  scoreDisplay.style.display = "block";
  statusDisplay.style.display = "block";

  // 重置狀態
  snake.body = [{ x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) }];
  snake.size = 5;
  snake.direction = { x: 0, y: -1 };
  score = 0;
  invincible = false;
  speedBoost = false;
  updateStatus("");

  redApple.reposition();
  goldApple.reposition();
  blueApple.reposition();
  updateScore();

  clearInterval(gameTimer);
  gameTimer = setInterval(gameLoop, speed);
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
