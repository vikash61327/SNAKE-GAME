const board = document.querySelector(".board");
const scoreElement = document.querySelector("#score");
const highScoreElemnt = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

const startBtn = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const reStartBtn = document.querySelector(".btn-restart");
const startgameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const blockHeight = 45;
const blockWidth = 45;
let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`;

//localStorage to set highScore
highScoreElemnt.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timerIntervalId = null;

//initial food position.
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
let snake = [
  { x: 1, y: 3 },
  { x: 1, y: 4 },
  { x: 1, y: 5 },
];

let direction = "down";

// for(let i=0; i<rows * cols ; i++){
//we can also write like thi
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText = `${row}-${col} `;
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;
  blocks[`${food.x}-${food.y}`].classList.add("food");
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    // alert("Game Over");
    clearInterval(intervalId);

    modal.style.display = "flex";
    startgameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  //Food Consume Logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);
    //score updatation
    score += 10;
    scoreElement.innerText = score;

    //highScore stored in localStorage.
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    // console.log(segment)
    //    console.log(blocks[`${segment.x}-${segment.y}`])
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

//start game
startBtn.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);

  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number); //array destructuring and also convert into number
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}-${sec}`;
    timeElement.innerText = time;
  }, 1000);
});

//restart game btn
reStartBtn.addEventListener("click", reStartGame);

function reStartGame() {
  direction = "down";
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  //update score on game restart
  score = 0;
  time = `00-00`;
  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElemnt.innerText = highScore;

  modal.style.display = "none";
  snake = [
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 3, y: 5 },
  ];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalId = setInterval(() => {
    render();
  }, 300);
}

//this for start the game
addEventListener("keydown", (e) => {
  // console.log(e.key);
  if (e.key === "ArrowUp") {
    direction = "up";
  } else if (e.key === "ArrowDown") {
    direction = "down";
  } else if (e.key === "ArrowLeft") {
    direction = "left";
  } else if (e.key === "ArrowRight") {
    direction = "right";
  }
});
