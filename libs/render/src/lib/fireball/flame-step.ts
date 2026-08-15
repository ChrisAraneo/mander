import type { Point } from '@mander/utils';

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
import type { FireballColors } from './fireball-colors';

const TAIL_LENGTH = 22;
const TAIL_HEIGHT = 4.5;

const FLICKER_SPEED = 14;
const FLICKER_DEPTH = 0.12;

const GLOW_BLUR = 18;

const tailStep = (colors: FireballColors, length: number): CanvasStep =>
  sequence([
    styled({ fillStyle: colors.tail }),
    beginPath,
    ellipse(
      -length / 2,
      0,
      length,
      (TAIL_HEIGHT * length) / TAIL_LENGTH,
      0,
      0,
      Math.PI * 2,
    ),
    fill,
  ]);

const ballStep = (radius: number, colors: FireballColors): CanvasStep =>
  sequence([
    beginPath,
    arc(0, 0, radius, 0, Math.PI * 2),
    outline(),
    styledWith((context) => ({
      fillStyle: radialGradient(context, 0, 0, 1, 0, 0, radius, [
        [0, colors.core],
        [0.45, colors.flame],
        [1, colors.edge],
      ]),
    })),
    fill,
    styled({ fillStyle: colors.core }),
    beginPath,
    arc(0, 0, radius / 2.6, 0, Math.PI * 2),
    fill,
  ]);

export const flickerOf = (angle: number, time: number): number =>
  1 + Math.sin(time * FLICKER_SPEED + angle) * FLICKER_DEPTH;

export const flameStep = (
  centre: Point,
  heading: number,
  radius: number,
  colors: FireballColors,
  tailLength = TAIL_LENGTH,
): CanvasStep =>
  sequence([
    save,
    translate(centre.x, centre.y),
    rotate(heading),
    styled({ shadowColor: colors.glow, shadowBlur: GLOW_BLUR }),
    tailStep(colors, tailLength),
    ballStep(radius, colors),
    restore,
  ]);
