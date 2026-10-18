import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawStroke } from '../../canvas/draw-stroke';
import type { CanvasStep } from '../../types/canvas-step';
import type { EnemyPalette } from './types/enemy-palette';

export const createEnemyBrowsStep = (palette: EnemyPalette): CanvasStep =>
  createSequenceStep([
    createStyleStep({ strokeStyle: palette.brow, lineWidth: 1.4 }),
    drawBeginPath,
    createMoveToStep(-7, -8),
    createLineToStep(-1, -6),
    createMoveToStep(7, -8),
    createLineToStep(1, -6),
    drawStroke,
  ]);
