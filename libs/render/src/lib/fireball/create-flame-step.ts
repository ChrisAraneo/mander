import type { Point } from '@mander/model';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import type { CanvasStep } from '../types/canvas-step';
import { createFlameBallStep } from './internal/create-flame-ball-step';
import type { FireballColors } from './types/fireball-colors';

export const createFlameStep = (
  center: Point,
  radius: number,
  colors: FireballColors,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createTranslateStep(center.x, center.y),
    createFlameBallStep(radius, colors),
    drawRestore,
  ]);
