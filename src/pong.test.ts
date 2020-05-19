import { State, Ball, resetBallState, initialBallState } from './pong';

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
