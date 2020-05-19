import {
  Ball,
  Player,
  radius,
  playerHeight,
  playerWidth,
  width,
  height,
  initialState,
  resetBallState,
  update,
  collision,
} from './pong';

const canvas: HTMLCanvasElement = document.querySelector('canvas')!;
const ctx = canvas.getContext('2d')!;
ctx.font = ctx.font.replace(/\d+px/, '75px');

canvas.width = width;
canvas.height = height;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  state.user.y = e.clientY - rect.top - playerHeight / 2;
});

let state = initialState();

step();

function step() {
  update(state);
  render();
  requestAnimationFrame(step);
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
