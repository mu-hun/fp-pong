import {
  State,
  Ball,
  resetBallState,
  initialBallState,
  initialState,
  collision,
  playerHeight,
  Player,
  radius,
  playerWidth,
} from './pong';

describe('Ball state management', () => {
  let ball: Ball;

  beforeEach(() => {
    ball = initialBallState();
  });

  test('Reset ball state', () => {
    ball.velocityX = 100;
    ball.velocityY = 100;
    ball.x = 10;
    ball.y = 10;
    ball.speed = 10;

    const expectBallState = {
      ...initialBallState(),
      velocityX: ball.velocityX * -1,
      velocityY: ball.velocityY,
    };

    expect(resetBallState(ball)).toEqual(expectBallState);
  });
});

describe('Collision Detection', () => {
  let ball: Ball, player: Player;
  beforeEach(() => {
    const state = initialState();
    ball = state.ball;
    player = state.user;
  });

  describe('Collision', () => {
    test('Top', () => {
      ball.x = player.x + playerWidth + radius - 1;
      ball.y = player.y + 1 - radius;
      expect(collision(ball, player)).toBe(true);
    });
    test('Middle', () => {
      ball.x = player.x + playerWidth + radius - 1;
      ball.y = player.y + playerHeight / 2;
      expect(collision(ball, player)).toBe(true);
    });
    test('Bottom', () => {
      ball.x = player.x + playerWidth + radius - 1;
      ball.y = player.y - 1 + playerHeight + radius;
      expect(collision(ball, player)).toBe(true);
    });
  });
  describe('Not Collision', () => {
    test('Top', () => {
      ball.x = player.x + playerWidth + radius;
      ball.y = player.y - 1 - radius;
      expect(collision(ball, player)).toBe(false);
    });
    test('Middle', () => {
      ball.x = player.x + playerWidth + radius;
      ball.y = player.y + playerHeight / 2;
      expect(collision(ball, player)).toBe(false);
    });
    test('Top', () => {
      ball.x = player.x + playerWidth + radius;
      ball.y = player.y + playerHeight - radius;
      expect(collision(ball, player)).toBe(false);
    });
  });
});
