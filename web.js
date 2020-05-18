const radius = 10;
const playerWidth = 10;
const playerHeight = 100;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.font = ctx.font.replace(/\d+px/, '75px');

const { height, width } = canvas;

canvas.addEventListener('mousemove', movePaddle);

function movePaddle(e) {
  const rect = canvas.getBoundingClientRect();
  user.y = e.clientY - rect.top - playerHeight / 2;
}

const player = {
  x: 0,
  y: height / 2 - 100 / 2,
  score: 0,
};

const initialBallState = {
  x: width / 2,
  y: height / 2,
  velocityX: 5,
  velocityY: 5,
  speed: 5,
};

const ball = Object.create(initialBallState);

function resetBallState() {
  ball.x = width / 2;
  ball.z = height / 2;
  ball.speed = 5;
  ball.velocityX *= -1;
}

const user = Object.create(player);
const computer = Object.create(player);
computer.x = canvas.width - 10;

step();

function step() {
  update();
  render();
  requestAnimationFrame(step);
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  const offsetY = ball.y - radius;
  const offsetX = ball.x - radius;

  if (offsetY > height || offsetY < 0) ball.velocityY = ball.velocityY * -1;
  if (offsetX > width || offsetX < 0) ball.velocityX = ball.velocityX * -1;

  const isLeft = ball.x < width / 2;

  const player = isLeft ? user : computer;
  if (collision(ball, player)) {
    const collidePoint =
      (ball.y - player.y + playerHeight / 2) / (playerHeight / 2);
    const angleRad = (Math.PI / 4) * collidePoint;
    const direction = isLeft ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.1;
  }

  computer.y += (ball.y - (computer.y + playerHeight / 2)) * 0.1;

  if (ball.x - radius < 0) {
    computer.score += 1;
    resetBallState();
  } else if (ball.x + radius > width) {
    user.score += 1;
    resetBallState();
  }
}

function render() {
  drawRect(0, 0, width, height, 'black');

  drawPlayer(user);
  drawPlayer(computer);

  drawBall();

  drawNet();

  drawScore(user);
  drawScore(computer);
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawPlayer(player) {
  const { x, y } = player;
  drawRect(x, y, playerWidth, playerHeight, 'white');
}

function drawNet() {
  const x = width / 2;
  for (let i = 0; i <= height; i += 25) {
    drawRect(x, i, 5, 10, 'white');
  }
}

function drawCircle(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawBall() {
  const { x, y } = ball;
  drawCircle(x, y, 'white');
}

function drawText(x, y, text, color) {
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawScore(player) {
  const { x: playerX, score } = player;
  const x = width / 4;
  const y = height / 5;

  if (playerX === 0) {
    drawText(x, y, score, 'white');
    return;
  }
  drawText(3 * x, y, score, 'white');
}

function collision(ball, player) {
  const pTop = player.y;
  const pBottom = pTop + playerHeight;
  const pLeft = player.x;
  const pRight = pLeft + playerWidth;

  const bTop = ball.y - radius;
  const bBottom = ball.y + radius;
  const bLeft = ball.x - radius;
  const bRight = ball.x + radius;

  return pTop < bBottom && pBottom > bTop && pLeft < bRight && pRight > bLeft;
}
