export const radius = 10;
export const playerWidth = 10;
export const playerHeight = 100;

export const [height, width] = [400, 600];

interface Coordinate {
  x: number;
  y: number;
}

export interface Player extends Coordinate {
  score: number;
}

export interface Ball extends Coordinate {
  velocityX: number;
  velocityY: number;
  speed: number;
}

export interface State {
  user: Player;
  computer: Player;
  ball: Ball;
}

export function initialState(): State {
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
    ball: initialBallState(),
  };
}

export function initialBallState(): Ball {
  return {
    x: width / 2,
    y: height / 2,
    velocityX: 5,
    velocityY: 5,
    speed: 5,
  };
}

export function resetBallState(previousState: Ball): Ball {
  return {
    ...previousState,
    x: width / 2,
    y: height / 2,
    speed: 5,
    velocityX: previousState.velocityX * -1,
  };
}

export function update(state: State) {
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

export function getPlayerPosition(player: Player) {
  const top = player.y;
  const bottom = top + playerHeight;
  const left = player.x;
  const right = left + playerWidth;

  return { top, bottom, left, right };
}

export function getBallPosition(ball: Ball) {
  const top = ball.y - radius;
  const bottom = ball.y + radius;
  const left = ball.x - radius;
  const right = ball.x + radius;

  return { top, bottom, left, right };
}

export function collision(ball: Ball, player: Player) {
  const p = getPlayerPosition(player);
  const b = getBallPosition(ball);

  return (
    p.top < b.bottom && p.bottom > b.top && p.left < b.right && p.right > b.left
  );
}
