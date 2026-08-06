import {
  type Enemy,
  type EnemyKind,
  ENEMY_DEATH_SECONDS,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  isAlive,
} from '@mander/engine';
import { chain, clamp, map } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { CanvasStep } from '../canvas/canvas-step';
import {
  arc,
  beginPath,
  closePath,
  ellipse,
  fill,
  lineTo,
  moveTo,
  rect,
  restore,
  rotate,
  roundRect,
  save,
  scale,
  stroke,
  styled,
  translate,
} from '../canvas/commands';
import { paint, sequence, when } from '../canvas/paint';
import { outline } from '../stroke/stroke';

const { number } = P;

const SQUASH_FLOOR = 0.15;

const HALF_WIDTH = ENEMY_WIDTH / 2;
const HALF_HEIGHT = ENEMY_HEIGHT / 2;

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

const bodyStep = (palette: EnemyPalette): CanvasStep =>
  sequence([
    beginPath,
    rect(-HALF_WIDTH + 3, HALF_HEIGHT - 4, 5, 3),
    rect(HALF_WIDTH - 8, HALF_HEIGHT - 4, 5, 3),
    outline(),
    styled({ fillStyle: palette.feet }),
    fill,
    beginPath,
    roundRect(
      -HALF_WIDTH + 2,
      -HALF_HEIGHT + 2,
      ENEMY_WIDTH - 4,
      ENEMY_HEIGHT - 4,
      6,
    ),
    outline(),
    styled({ fillStyle: palette.body }),
    fill,
    styled({ fillStyle: palette.belly }),
    beginPath,
    roundRect(-HALF_WIDTH + 5, -1, ENEMY_WIDTH - 10, HALF_HEIGHT - 3, 4),
    fill,
  ]);

const HORN_X_POSITIONS = [-5, 0, 5];
const HORN_BASE_Y = -9;
const HORN_TIP_Y = -15;
const HORN_HALF_WIDTH = 2;

const hornStep = (hornX: number, palette: EnemyPalette): CanvasStep =>
  sequence([
    beginPath,
    moveTo(hornX - HORN_HALF_WIDTH, HORN_BASE_Y),
    lineTo(hornX + HORN_HALF_WIDTH, HORN_BASE_Y),
    lineTo(hornX, HORN_TIP_Y),
    closePath,
    outline(),
    styled({ fillStyle: palette.feet }),
    fill,
  ]);

const hornsStep = (palette: EnemyPalette): CanvasStep =>
  sequence(map(HORN_X_POSITIONS, (hornX) => hornStep(hornX, palette)));

const WING_COLOR = '#FFFFFF';
const WING_FLAP_SPEED = 10;
const WING_FLAP_ANGLE = 0.6;
const WING_SIDES = [-1, 1];

const wingStep = (side: number, flap: number): CanvasStep =>
  sequence([
    save,
    translate(side * (HALF_WIDTH - 3), -3),
    rotate(side * flap),
    beginPath,
    ellipse(side * 7, 0, 8, 3.5, 0, 0, Math.PI * 2),
    outline(),
    styled({ fillStyle: WING_COLOR }),
    fill,
    restore,
  ]);

const wingsStep = (time: number): CanvasStep =>
  chain(Math.sin(time * WING_FLAP_SPEED) * WING_FLAP_ANGLE)
    .thru((flap) => map(WING_SIDES, (side) => wingStep(side, flap)))
    .thru(sequence)
    .value();

const deadEyesStep: CanvasStep = sequence([
  styled({ lineWidth: 1.2 }),
  beginPath,
  moveTo(-6, -6),
  lineTo(-1.5, -2),
  moveTo(-1.5, -6),
  lineTo(-6, -2),
  moveTo(1, -6),
  lineTo(5.5, -2),
  moveTo(5.5, -6),
  lineTo(1, -2),
  stroke,
]);

const livingEyesStep: CanvasStep = sequence([
  beginPath,
  arc(-3, -4, 1.4, 0, Math.PI * 2),
  arc(4, -4, 1.4, 0, Math.PI * 2),
  fill,
]);

const eyesStep = (isDying: boolean): CanvasStep =>
  sequence([
    styled({ fillStyle: '#FDF3EA' }),
    beginPath,
    arc(-4, -4, 3.2, 0, Math.PI * 2),
    arc(3, -4, 3.2, 0, Math.PI * 2),
    fill,
    styled({ strokeStyle: '#1C1C28', fillStyle: '#1C1C28' }),
    match(isDying)
      .with(true, () => deadEyesStep)
      .otherwise(() => livingEyesStep),
  ]);

const browsStep = (palette: EnemyPalette): CanvasStep =>
  sequence([
    styled({ strokeStyle: palette.brow, lineWidth: 1.4 }),
    beginPath,
    moveTo(-7, -8),
    lineTo(-1, -6),
    moveTo(7, -8),
    lineTo(1, -6),
    stroke,
  ]);

const deathProgress = (death: Enemy['timers']['death']): number =>
  match(death)
    .with(number, (seconds) => clamp(seconds / ENEMY_DEATH_SECONDS, 0, 1))
    .otherwise(() => 0);

export const drawEnemy = (
  context: CanvasRenderingContext2D,
  enemy: Enemy,
  time: number,
): void =>
  chain({
    isDying: !isAlive(enemy),
    progress: deathProgress(enemy.timers.death),
    palette: paletteFor(enemy.kind),
  })
    .thru((stage) => ({
      ...stage,
      squash: 1 - stage.progress * (1 - SQUASH_FLOOR),
      facing: match(enemy.statuses.isFacingRight)
        .with(true, () => 1)
        .otherwise(() => -1),
      wobble: match(enemy.statuses.isGrounded && !stage.isDying)
        .with(true, () => Math.sin(time * 9 + enemy.spawn.x * 0.2) * 1.2)
        .otherwise(() => 0),
    }))
    .thru(({ isDying, progress, palette, squash, facing, wobble }) =>
      paint(
        context,
        save,
        translate(
          enemy.position.x + HALF_WIDTH,
          enemy.position.y + HALF_HEIGHT + wobble + HALF_HEIGHT * (1 - squash),
        ),
        styled({ globalAlpha: 1 - progress * progress }),
        scale(facing * (1 + progress * 0.35), squash),
        when(enemy.kind === 'FLYING', wingsStep(time)),
        bodyStep(palette),
        when(enemy.kind === 'HORNED', hornsStep(palette)),
        eyesStep(isDying),
        browsStep(palette),
        restore,
      ),
    )
    .value();
