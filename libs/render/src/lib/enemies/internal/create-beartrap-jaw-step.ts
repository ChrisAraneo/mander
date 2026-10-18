import { createRotateStep } from '../../canvas/create-rotate-step';
import { createRoundRectStep } from '../../canvas/create-round-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { createTranslateStep } from '../../canvas/create-translate-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import {
  JAW_HINGE_X,
  JAW_HINGE_Y,
  JAW_THICKNESS,
  BEARTRAP_STEEL,
} from './consts';
import { drawBeartrapTeeth } from './draw-beartrap-teeth';

const JAW_LENGTH = 15;

export const createBeartrapJawStep = (tilt: number): CanvasStep =>
  createSequenceStep([
    drawSave,
    createTranslateStep(-JAW_HINGE_X, JAW_HINGE_Y),
    createRotateStep(tilt),
    drawBeginPath,
    createRoundRectStep(
      -JAW_THICKNESS / 2,
      -JAW_LENGTH,
      JAW_THICKNESS,
      JAW_LENGTH,
      1.6,
    ),
    outline(),
    createStyleStep({ fillStyle: BEARTRAP_STEEL }),
    drawFill,
    drawBeartrapTeeth,
    drawRestore,
  ]);
