import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';
import { HALF_TILE } from './consts';

const RIVET_RADIUS = 1.5;

const RIVET_INSET = 5;

export const createCannonRivetStep = (
  sideX: number,
  sideY: number,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createArcStep(
      sideX * (HALF_TILE - RIVET_INSET),
      sideY * (HALF_TILE - RIVET_INSET),
      RIVET_RADIUS,
      0,
      Math.PI * 2,
    ),
    drawFill,
  ]);
