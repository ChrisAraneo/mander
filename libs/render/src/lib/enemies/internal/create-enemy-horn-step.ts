import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawClosePath } from '../../canvas/draw-close-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import type { EnemyPalette } from './types/enemy-palette';

const HORN_BASE_Y = -9;

const HORN_TIP_Y = -15;

const HORN_HALF_WIDTH = 2;

export const createEnemyHornStep = (
  hornX: number,
  palette: EnemyPalette,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createMoveToStep(hornX - HORN_HALF_WIDTH, HORN_BASE_Y),
    createLineToStep(hornX + HORN_HALF_WIDTH, HORN_BASE_Y),
    createLineToStep(hornX, HORN_TIP_Y),
    drawClosePath,
    outline(),
    createStyleStep({ fillStyle: palette.feet }),
    drawFill,
  ]);
