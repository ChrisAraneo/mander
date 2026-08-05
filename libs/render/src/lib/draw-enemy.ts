import {
  type Enemy,
  type EnemyKind,
  ENEMY_DEATH_SECONDS,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  isAlive,
} from '@mander/engine';
import { clamp } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { strokeOutline } from './stroke';

const SQUASH_FLOOR = 0.15;

interface EnemyPalette {
  feet: string;
  body: string;
  belly: string;
  brow: string;
}

const HOPPING_PALETTE: EnemyPalette = {
  feet: '#2A7D2A',
  body: '#3FB53F',
  belly: '#5FD55F',
  brow: '#123A12',
};

const HORNED_PALETTE: EnemyPalette = {
  feet: '#7D2F2A',
  body: '#B5473F',
  belly: '#D5695F',
  brow: '#3A1512',
};

const FLYING_PALETTE: EnemyPalette = {
  feet: '#1E5FA8',
  body: '#3C8DE0',
  belly: '#7FC3FF',
  brow: '#123A6B',
};

const paletteFor = (kind: EnemyKind): EnemyPalette =>
  match(kind)
    .with('HORNED', () => HORNED_PALETTE)
    .with('FLYING', () => FLYING_PALETTE)
    .otherwise(() => HOPPING_PALETTE);

const drawEnemyBody = (
  context: CanvasRenderingContext2D,
  halfWidth: number,
  halfHeight: number,
  palette: EnemyPalette,
): void => {
  context.beginPath();
  context.rect(-halfWidth + 3, halfHeight - 4, 5, 3);
  context.rect(halfWidth - 8, halfHeight - 4, 5, 3);
  strokeOutline(context);
  context.fillStyle = palette.feet;
  context.fill();

  context.beginPath();
  context.roundRect(
    -halfWidth + 2,
    -halfHeight + 2,
    ENEMY_WIDTH - 4,
    ENEMY_HEIGHT - 4,
    6,
  );
  strokeOutline(context);
  context.fillStyle = palette.body;
  context.fill();

  context.fillStyle = palette.belly;
  context.beginPath();
  context.roundRect(-halfWidth + 5, -1, ENEMY_WIDTH - 10, halfHeight - 3, 4);
  context.fill();
};

const HORN_X_POSITIONS = [-5, 0, 5];
const HORN_BASE_Y = -9;
const HORN_TIP_Y = -15;
const HORN_HALF_WIDTH = 2;

const drawEnemyHorns = (
  context: CanvasRenderingContext2D,
  palette: EnemyPalette,
): void => {
  for (const hornX of HORN_X_POSITIONS) {
    context.beginPath();
    context.moveTo(hornX - HORN_HALF_WIDTH, HORN_BASE_Y);
    context.lineTo(hornX + HORN_HALF_WIDTH, HORN_BASE_Y);
    context.lineTo(hornX, HORN_TIP_Y);
    context.closePath();
    strokeOutline(context);
    context.fillStyle = palette.feet;
    context.fill();
  }
};

const WING_COLOR = '#FFFFFF';
const WING_FLAP_SPEED = 10;
const WING_FLAP_ANGLE = 0.6;

const drawEnemyWings = (
  context: CanvasRenderingContext2D,
  halfWidth: number,
  time: number,
): void => {
  const flap = Math.sin(time * WING_FLAP_SPEED) * WING_FLAP_ANGLE;

  for (const side of [-1, 1] as const) {
    context.save();
    context.translate(side * (halfWidth - 3), -3);
    context.rotate(side * flap);
    context.beginPath();
    context.ellipse(side * 7, 0, 8, 3.5, 0, 0, Math.PI * 2);
    strokeOutline(context);
    context.fillStyle = WING_COLOR;
    context.fill();
    context.restore();
  }
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

const drawEnemyBrows = (
  context: CanvasRenderingContext2D,
  palette: EnemyPalette,
): void => {
  context.strokeStyle = palette.brow;
  context.lineWidth = 1.4;
  context.beginPath();
  context.moveTo(-7, -8);
  context.lineTo(-1, -6);
  context.moveTo(7, -8);
  context.lineTo(1, -6);
  context.stroke();
};

const deathProgress = (death: Enemy['timers']['death']): number =>
  match(death)
    .with(P.number, (seconds) => clamp(seconds / ENEMY_DEATH_SECONDS, 0, 1))
    .otherwise(() => 0);

export const drawEnemy = (
  context: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number,
): void => {
  const centerX = enemy.position.x + ENEMY_WIDTH / 2;
  const centerY = enemy.position.y + ENEMY_HEIGHT / 2;
  const isDying = !isAlive(enemy);
  const progress = deathProgress(enemy.timers.death);
  const squash = 1 - progress * (1 - SQUASH_FLOOR);
  const wobble = match(enemy.statuses.isGrounded && !isDying)
    .with(true, () => Math.sin(time * 9 + enemy.spawn.x * 0.2) * 1.2)
    .otherwise(() => 0);
  const facing = enemy.statuses.isFacingRight ? 1 : -1;
  const halfWidth = ENEMY_WIDTH / 2;
  const halfHeight = ENEMY_HEIGHT / 2;
  const palette = paletteFor(enemy.kind);

  context.save();
  context.translate(centerX, centerY + wobble + halfHeight * (1 - squash));
  context.globalAlpha = 1 - progress * progress;
  context.scale(facing * (1 + progress * 0.35), squash);

  match(enemy.kind)
    .with('FLYING', () => drawEnemyWings(context, halfWidth, time))
    .otherwise(() => undefined);
  drawEnemyBody(context, halfWidth, halfHeight, palette);
  match(enemy.kind)
    .with('HORNED', () => drawEnemyHorns(context, palette))
    .otherwise(() => undefined);
  drawEnemyEyes(context, isDying);
  drawEnemyBrows(context, palette);

  context.restore();
};
