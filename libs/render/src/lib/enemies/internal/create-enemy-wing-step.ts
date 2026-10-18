import { createEllipseStep } from '../../canvas/create-ellipse-step';
import { createRotateStep } from '../../canvas/create-rotate-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { createTranslateStep } from '../../canvas/create-translate-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import { HALF_WIDTH } from './consts';

const WING_COLOR = '#FFFFFF';

export const createEnemyWingStep = (side: number, flap: number): CanvasStep =>
  createSequenceStep([
    drawSave,
    createTranslateStep(side * (HALF_WIDTH - 3), -3),
    createRotateStep(side * flap),
    drawBeginPath,
    createEllipseStep(side * 7, 0, 8, 3.5, 0, 0, Math.PI * 2),
    outline(),
    createStyleStep({ fillStyle: WING_COLOR }),
    drawFill,
    drawRestore,
  ]);
