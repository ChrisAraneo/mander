import {
  FIREBALL_SIZE,
  fireballHeading,
  fireballPosition,
} from '@mander/engine';
import type { Fireball } from '@mander/model';

import {
  arc,
  beginPath,
  type CanvasStep,
  ellipse,
  fill,
  radialGradient,
  restore,
  rotate,
  save,
  sequence,
  styled,
  styledWith,
  translate,
} from '../canvas';
import { outline } from '../stroke';

const RADIUS = FIREBALL_SIZE / 2;

const TAIL_LENGTH = 22;
const TAIL_HEIGHT = 4.5;

const FLICKER_SPEED = 14;
const FLICKER_DEPTH = 0.12;

const CORE_COLOR = '#FFF3C4';
const FLAME_COLOR = '#FFB03A';
const EDGE_COLOR = '#D8341C';
const TAIL_COLOR = 'RGBA(255, 138, 42, 0.5)';
const GLOW_COLOR = '#FF7A2F';
const GLOW_BLUR = 18;

const tailStep: CanvasStep = sequence([
  styled({ fillStyle: TAIL_COLOR }),
  beginPath,
  ellipse(-TAIL_LENGTH / 2, 0, TAIL_LENGTH, TAIL_HEIGHT, 0, 0, Math.PI * 2),
  fill,
]);

const flameStep = (flicker: number): CanvasStep =>
  sequence([
    beginPath,
    arc(0, 0, RADIUS * flicker, 0, Math.PI * 2),
    outline(),
    styledWith((context) => ({
      fillStyle: radialGradient(context, 0, 0, 1, 0, 0, RADIUS * flicker, [
        [0, CORE_COLOR],
        [0.45, FLAME_COLOR],
        [1, EDGE_COLOR],
      ]),
    })),
    fill,
    styled({ fillStyle: CORE_COLOR }),
    beginPath,
    arc(0, 0, (RADIUS * flicker) / 2.6, 0, Math.PI * 2),
    fill,
  ]);

const flickerOf = (fireball: Fireball, time: number): number =>
  1 + Math.sin(time * FLICKER_SPEED + fireball.angle) * FLICKER_DEPTH;

export const fireballStep = (fireball: Fireball, time: number): CanvasStep => {
  const centre = fireballPosition(fireball);

  return sequence([
    save,
    translate(centre.x, centre.y),
    rotate(fireballHeading(fireball)),
    styled({ shadowColor: GLOW_COLOR, shadowBlur: GLOW_BLUR }),
    tailStep,
    flameStep(flickerOf(fireball, time)),
    restore,
  ]);
};
