import { type Player, PLAYER_HEIGHT, PLAYER_WIDTH } from '@mander/engine';

const drawPlayerLegs = (
  context: CanvasRenderingContext2D,
  isGrounded: boolean,
  swing: number,
): void => {
  context.fillStyle = '#3f5a86';
  const legTop = 5;
  const legHeight = PLAYER_HEIGHT / 2 - legTop;
  if (isGrounded) {
    context.fillRect(-6 + swing / 2, legTop, 5, legHeight);
    context.fillRect(2 - swing / 2, legTop, 5, legHeight);
  } else {
    context.fillRect(-6, legTop, 5, legHeight - 2);
    context.fillRect(2, legTop + 2, 5, legHeight - 2);
  }
};

const drawPlayerBody = (
  context: CanvasRenderingContext2D,
  swing: number,
): void => {
  context.fillStyle = '#f4762c';
  context.beginPath();
  context.roundRect(-7, -6, 14, 13, 4);
  context.fill();

  context.fillStyle = '#e0651f';
  context.beginPath();
  context.roundRect(-2 - swing / 2, -4, 4, 9, 2);
  context.fill();
};

const drawPlayerHead = (context: CanvasRenderingContext2D): void => {
  context.fillStyle = '#f2c49b';
  context.beginPath();
  context.arc(1, -9, 5.5, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#4a3021';
  context.beginPath();
  context.arc(0.5, -10.5, 5.4, Math.PI * 0.95, Math.PI * 2.02);
  context.fill();

  context.fillStyle = '#1c1c28';
  context.beginPath();
  context.arc(3.4, -8.6, 1.2, 0, Math.PI * 2);
  context.fill();
};

export const drawPlayer = (
  context: CanvasRenderingContext2D,
  player: Player,
  time: number,
): void => {
  const centerX = player.x + PLAYER_WIDTH / 2;
  const centerY = player.y + PLAYER_HEIGHT / 2;
  const isRunning = Math.abs(player.vx) > 1 && player.isGrounded;
  const swing = isRunning ? Math.sin(time * 14) * 4 : 0;

  context.save();
  context.translate(centerX, centerY);
  context.scale(player.facing, 1);

  drawPlayerLegs(context, player.isGrounded, swing);
  drawPlayerBody(context, swing);
  drawPlayerHead(context);

  context.restore();
};
