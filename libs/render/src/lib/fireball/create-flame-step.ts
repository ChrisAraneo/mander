import type { Point } from '@mander/utils';
import { createRotateStep } from '../canvas/create-rotate-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import type { CanvasStep } from '../types/canvas-step';
import { TAIL_LENGTH } from './internal/consts';
import { createFlameBallStep } from './internal/create-flame-ball-step';
import { createFlameTailStep } from './internal/create-flame-tail-step';
import type { FireballColors } from './types/fireball-colors';

export const createFlameStep = (
  center: Point,
  heading: number,
  radius: number,
  colors: FireballColors,
  tailLength = TAIL_LENGTH,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createTranslateStep(center.x, center.y),
    createRotateStep(heading),
    createFlameTailStep(colors, tailLength),
    createFlameBallStep(radius, colors),
    drawRestore,
  ]);
