import type { Point } from '@mander/utils';
import { createScaleStep } from '../canvas/create-scale-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { computeVelocityFacing } from '../compute-velocity-facing';
import type { CanvasStep } from '../types/canvas-step';

export const createProjectileStep = (
  position: Point,
  radius: number,
  velocityX: number,
  ...parts: CanvasStep[]
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createTranslateStep(position.x + radius, position.y + radius),
    createScaleStep(computeVelocityFacing(velocityX), 1),
    ...parts,
    drawRestore,
  ]);
