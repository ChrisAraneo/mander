import type { Point } from '@mander/utils';

import {
  applyStyle,
  applyStyleWith,
  beginPath,
  type CanvasStep,
  createRadialGradient,
  fill,
  restore,
  rotate,
  save,
  sequence,
  traceArc,
  traceEllipse,
  translate,
} from '../canvas';
import { outline } from '../stroke';
import type { FireballColors } from './fireball-colors';

const TAIL_LENGTH = 22;
const TAIL_HEIGHT = 4.5;

const FLICKER_SPEED = 14;
const FLICKER_DEPTH = 0.12;

const createTailStep = (colors: FireballColors, length: number): CanvasStep =>
  sequence([
    applyStyle({ fillStyle: colors.tail }),
    beginPath,
    traceEllipse(
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

const createBallStep = (radius: number, colors: FireballColors): CanvasStep =>
  sequence([
    beginPath,
    traceArc(0, 0, radius, 0, Math.PI * 2),
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createRadialGradient(context, 0, 0, 1, 0, 0, radius, [
        [0, colors.core],
        [0.45, colors.flame],
        [1, colors.edge],
      ]),
    })),
    fill,
    applyStyle({ fillStyle: colors.core }),
    beginPath,
    traceArc(0, 0, radius / 2.6, 0, Math.PI * 2),
    fill,
  ]);

export const getFlicker = (angle: number, time: number): number =>
  1 + Math.sin(time * FLICKER_SPEED + angle) * FLICKER_DEPTH;

export const createFlameStep = (
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
    createTailStep(colors, tailLength),
    createBallStep(radius, colors),
    restore,
  ]);
