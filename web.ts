const radius = 10;
const playerWidth = 10;
const playerHeight = 100;

const canvas: HTMLCanvasElement = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
ctx.font = ctx.font.replace(/\d+px/, '75px');

const { height, width } = canvas;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  state.user.y = e.clientY - rect.top - playerHeight / 2;
});

interface Coordinate {
  x: number;
  y: number;
}

interface Player extends Coordinate {
  score: number;
}

interface Ball extends Coordinate {
  velocityX: number;
  velocityY: number;
  speed: number;
}

interface State {
  user: Player;
  computer: Player;
  ball: Ball;
}

function initialState(): State {
  const player = {
    y: height / 2 - 100 / 2,
    score: 0,
  };

  return {
    user: {
      x: 0,
      ...player,
    },
    computer: {
      x: width - 10,
      ...player,
    },
    ball: {
      x: width / 2,
      y: height / 2,
      velocityX: 5,
      velocityY: 5,
      speed: 5,
    },
  };
}

let state = initialState();

function resetBallState(previousState: Ball): Ball {
  return {
    ...previousState,
    x: width / 2,
    y: height / 2,
    speed: 5,
    velocityX: previousState.velocityX * -1,
  };
}

step();

function step() {
  update();
  render();
  requestAnimationFrame(step);
}

function update() {
  state.ball.x += state.ball.velocityX;
  state.ball.y += state.ball.velocityY;

  const offsetY = state.ball.y - radius;
  const offsetX = state.ball.x - radius;

  if (offsetY > height || offsetY < 0) state.ball.velocityY *= -1;
  if (offsetX > width || offsetX < 0) state.ball.velocityX *= -1;

  const isLeft = state.ball.x < width / 2;

  const player = isLeft ? state.user : state.computer;
  if (collision(state.ball, player)) {
    const collidePoint =
      (state.ball.y - player.y + playerHeight / 2) / (playerHeight / 2);
    const angleRad = (Math.PI / 4) * collidePoint;
    const direction = isLeft ? 1 : -1;

    state.ball.velocityX = direction * state.ball.speed * Math.cos(angleRad);
    state.ball.velocityY = state.ball.speed * Math.sin(angleRad);

    state.ball.speed += 0.1;
  }

  state.computer.y +=
    (state.ball.y - (state.computer.y + playerHeight / 2)) * 0.1;

  if (state.ball.x - radius < 0) {
    state.computer.score += 1;
    state.ball = resetBallState(state.ball);
  } else if (state.ball.x + radius > width) {
    state.user.score += 1;
    state.ball = resetBallState(state.ball);
  }
}

function collision(ball: Ball, player: Player) {
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

function render() {
  drawRect(0, 0, width, height, 'black');

  drawPlayer(state.user);
  drawPlayer(state.computer);

  drawBall(state.ball);

  drawNet();

  drawScore(state.user);
  drawScore(state.computer);
}

function drawRect(x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawPlayer(player: Player) {
  const { x, y } = player;
  drawRect(x, y, playerWidth, playerHeight, 'white');
}

function drawNet() {
  const x = width / 2;
  for (let i = 0; i <= height; i += 25) {
    drawRect(x, i, 5, 10, 'white');
  }
}

function drawCircle(x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawBall(ball: Ball) {
  const { x, y } = ball;
  drawCircle(x, y, 'white');
}

function drawText(x: number, y: number, text: string, color: string) {
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawScore(player: Player) {
  const { x: playerX, score } = player;
  const x = width / 4;
  const y = height / 5;

  if (playerX === 0) {
    drawText(x, y, score.toString(), 'white');
    return;
  }
  drawText(3 * x, y, score.toString(), 'white');
}
