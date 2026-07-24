import {
  type Enemy,
  ENEMY_DEATH_SECONDS,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  isAlive,
} from '@mander/engine';
import { clamp } from 'lodash-es';
import { match, P } from 'ts-pattern';

const SQUASH_FLOOR = 0.15;

const drawEnemyBody = (
  context: CanvasRenderingContext2D,
  halfWidth: number,
  halfHeight: number,
): void => {
  context.fillStyle = '#7D2F2A';
  context.fillRect(-halfWidth + 3, halfHeight - 4, 5, 3);
  context.fillRect(halfWidth - 8, halfHeight - 4, 5, 3);

  context.fillStyle = '#B5473F';
  context.beginPath();
  context.roundRect(
    -halfWidth + 2,
    -halfHeight + 2,
    ENEMY_WIDTH - 4,
    ENEMY_HEIGHT - 4,
    6,
  );
  context.fill();

  context.fillStyle = '#D5695F';
  context.beginPath();
  context.roundRect(-halfWidth + 5, -1, ENEMY_WIDTH - 10, halfHeight - 3, 4);
  context.fill();
};

const drawEnemyEyes = (
  context: CanvasRenderingContext2D,
  isDying: boolean,
): void => {
  context.fillStyle = '#FDF3EA';
  context.beginPath();
  context.arc(-4, -4, 3.2, 0, Math.PI * 2);
  context.arc(3, -4, 3.2, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = '#1C1C28';
  context.fillStyle = '#1C1C28';
  match(isDying)
    .with(true, () => {
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(-6, -6);
      context.lineTo(-1.5, -2);
      context.moveTo(-1.5, -6);
      context.lineTo(-6, -2);
      context.moveTo(1, -6);
      context.lineTo(5.5, -2);
      context.moveTo(5.5, -6);
      context.lineTo(1, -2);
      context.stroke();
    })
    .otherwise(() => {
      context.beginPath();
      context.arc(-3, -4, 1.4, 0, Math.PI * 2);
      context.arc(4, -4, 1.4, 0, Math.PI * 2);
      context.fill();
    });
};

const drawEnemyBrows = (context: CanvasRenderingContext2D): void => {
  context.strokeStyle = '#3A1512';
  context.lineWidth = 1.4;
  context.beginPath();
  context.moveTo(-7, -8);
  context.lineTo(-1, -6);
  context.moveTo(7, -8);
  context.lineTo(1, -6);
  context.stroke();
};

const deathProgress = (dyingFor: Enemy['dyingFor']): number =>
  match(dyingFor)
    .with(P.number, (seconds) => clamp(seconds / ENEMY_DEATH_SECONDS, 0, 1))
    .otherwise(() => 0);

export const drawEnemy = (
  context: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number,
): void => {
  const centerX = enemy.x + ENEMY_WIDTH / 2;
  const centerY = enemy.y + ENEMY_HEIGHT / 2;
  const isDying = !isAlive(enemy);
  const progress = deathProgress(enemy.dyingFor);
  const squash = 1 - progress * (1 - SQUASH_FLOOR);
  const wobble = match(enemy.isGrounded && !isDying)
    .with(true, () => Math.sin(time * 9 + enemy.homeX * 0.2) * 1.2)
    .otherwise(() => 0);
  const halfWidth = ENEMY_WIDTH / 2;
  const halfHeight = ENEMY_HEIGHT / 2;

  context.save();
  context.translate(centerX, centerY + wobble + halfHeight * (1 - squash));
  context.globalAlpha = 1 - progress * progress;
  context.scale(enemy.facing * (1 + progress * 0.35), squash);

  drawEnemyBody(context, halfWidth, halfHeight);
  drawEnemyEyes(context, isDying);
  drawEnemyBrows(context);

  context.restore();
};
