import {
  isAlive,
  type Player,
  PLAYER_DEATH_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from '@mander/engine';
import { clamp } from 'lodash-es';
import { match, P } from 'ts-pattern';

const HALF_HEIGHT = PLAYER_HEIGHT / 2;
const HEAD_RADIUS = 7;
const HEAD_CENTER_Y = -HALF_HEIGHT + HEAD_RADIUS + 1;
const TORSO_TOP = HEAD_CENTER_Y + HEAD_RADIUS;
const LEG_HEIGHT = 18;
const LEG_TOP = HALF_HEIGHT - LEG_HEIGHT;
const DEATH_SPIN = Math.PI * 0.9;

const drawPlayerLegs = (
  context: CanvasRenderingContext2D,
  isGrounded: boolean,
  swing: number,
): void => {
  context.fillStyle = '#3F5A86';
  match(isGrounded)
    .with(true, () => {
      context.fillRect(-7 + swing / 2, LEG_TOP, 5, LEG_HEIGHT);
      context.fillRect(2 - swing / 2, LEG_TOP, 5, LEG_HEIGHT);
    })
    .otherwise(() => {
      context.fillRect(-7, LEG_TOP, 5, LEG_HEIGHT - 3);
      context.fillRect(2, LEG_TOP + 3, 5, LEG_HEIGHT - 3);
    });
};

const drawPlayerBody = (
  context: CanvasRenderingContext2D,
  swing: number,
): void => {
  context.fillStyle = '#F4762C';
  context.beginPath();
  context.roundRect(-8, TORSO_TOP, 16, LEG_TOP - TORSO_TOP + 4, 5);
  context.fill();

  context.fillStyle = '#E0651F';
  context.beginPath();
  context.roundRect(-2 - swing / 2, TORSO_TOP + 3, 4, 12, 2);
  context.fill();
};

const drawPlayerEye = (
  context: CanvasRenderingContext2D,
  isDying: boolean,
): void => {
  context.fillStyle = '#1C1C28';
  match(isDying)
    .with(true, () => {
      context.strokeStyle = '#1C1C28';
      context.lineWidth = 1.4;
      context.beginPath();
      context.moveTo(2.4, HEAD_CENTER_Y - 1.4);
      context.lineTo(6, HEAD_CENTER_Y + 2.2);
      context.moveTo(6, HEAD_CENTER_Y - 1.4);
      context.lineTo(2.4, HEAD_CENTER_Y + 2.2);
      context.stroke();
    })
    .otherwise(() => {
      context.beginPath();
      context.arc(4.2, HEAD_CENTER_Y + 0.4, 1.5, 0, Math.PI * 2);
      context.fill();
    });
};

const drawPlayerHead = (
  context: CanvasRenderingContext2D,
  isDying: boolean,
): void => {
  context.fillStyle = '#F2C49B';
  context.beginPath();
  context.arc(1, HEAD_CENTER_Y, HEAD_RADIUS, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#4A3021';
  context.beginPath();
  context.arc(
    0.5,
    HEAD_CENTER_Y - 1.5,
    HEAD_RADIUS - 0.2,
    Math.PI * 0.95,
    Math.PI * 2.02,
  );
  context.fill();

  drawPlayerEye(context, isDying);
};

const deathProgress = (dyingFor: Player['dyingFor']): number =>
  match(dyingFor)
    .with(P.number, (seconds) => clamp(seconds / PLAYER_DEATH_SECONDS, 0, 1))
    .otherwise(() => 0);

export const drawPlayer = (
  context: CanvasRenderingContext2D,
  player: Player,
  time: number,
): void => {
  const centerX = player.x + PLAYER_WIDTH / 2;
  const centerY = player.y + PLAYER_HEIGHT / 2;
  const isDying = !isAlive(player);
  const progress = deathProgress(player.dyingFor);
  const isRunning = Math.abs(player.vx) > 1 && player.isGrounded;
  const swing = match(isRunning)
    .with(true, () => Math.sin(time * 14) * 5)
    .otherwise(() => 0);

  context.save();
  context.translate(centerX, centerY);
  context.globalAlpha = 1 - progress * progress;
  context.rotate(-player.facing * progress * DEATH_SPIN);
  context.scale(player.facing, 1);

  drawPlayerLegs(context, player.isGrounded, swing);
  drawPlayerBody(context, swing);
  drawPlayerHead(context, isDying);

  context.restore();
};
