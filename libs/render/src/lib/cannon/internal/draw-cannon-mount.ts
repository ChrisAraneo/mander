import { TILE_SIZE } from '@mander/model';
import { createContextStyleStep } from '../../canvas/create-context-style-step';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createLinearGradient } from '../../canvas/create-linear-gradient';
import { createRoundRectStep } from '../../canvas/create-round-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import { HALF_TILE, IRON, IRON_DARK, IRON_LIGHT } from './consts';

const MOUNT_INSET = 1;

const MOUNT_RADIUS = 5;

export const drawCannonMount: CanvasStep = createSequenceStep([
  drawBeginPath,
  createRoundRectStep(
    -HALF_TILE + MOUNT_INSET,
    -HALF_TILE + MOUNT_INSET,
    TILE_SIZE - MOUNT_INSET * 2,
    TILE_SIZE - MOUNT_INSET * 2,
    MOUNT_RADIUS,
  ),
  outline(),
  createContextStyleStep((context) => ({
    fillStyle: createLinearGradient(context, 0, -HALF_TILE, 0, HALF_TILE, [
      [0, IRON],
      [1, IRON_DARK],
    ]),
  })),
  drawFill,
  createStyleStep({ fillStyle: IRON_LIGHT }),
  createFillRectStep(-HALF_TILE + 4, -HALF_TILE + 3, TILE_SIZE - 8, 3),
]);
