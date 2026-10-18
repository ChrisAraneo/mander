import { createRoundRectStep } from '../../canvas/create-round-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import type { PlayerColors } from '../types/player-colors';
import { HEAD_CENTER_Y, HEAD_RADIUS, LEG_TOP } from './consts';

const TORSO_TOP = HEAD_CENTER_Y + HEAD_RADIUS;

export const createPlayerBodyStep = (
  swing: number,
  colors: PlayerColors,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createRoundRectStep(-8, TORSO_TOP, 16, LEG_TOP - TORSO_TOP + 4, 5),
    outline(),
    createStyleStep({ fillStyle: colors.body }),
    drawFill,
    createStyleStep({ fillStyle: colors.strap }),
    drawBeginPath,
    createRoundRectStep(-2 - swing / 2, TORSO_TOP + 3, 4, 12, 2),
    drawFill,
  ]);
