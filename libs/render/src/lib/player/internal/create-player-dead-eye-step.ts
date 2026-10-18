import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawStroke } from '../../canvas/draw-stroke';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { HEAD_CENTER_Y } from './consts';

export const createPlayerDeadEyeStep = (colors: PlayerColors): CanvasStep =>
  createSequenceStep([
    createStyleStep({ strokeStyle: colors.eye, lineWidth: 1.4 }),
    drawBeginPath,
    createMoveToStep(2.4, HEAD_CENTER_Y - 1.4),
    createLineToStep(6, HEAD_CENTER_Y + 2.2),
    createMoveToStep(6, HEAD_CENTER_Y - 1.4),
    createLineToStep(2.4, HEAD_CENTER_Y + 2.2),
    drawStroke,
  ]);
