import { createArcStep } from '../../canvas/create-arc-step';
import { createConditionalStep } from '../../canvas/create-conditional-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import type { CanvasStep } from '../../types/canvas-step';
import { BARREL_LENGTH } from './consts';

const CHARGE_RADIUS = 6;

const CHARGE_COLOR = '#FF9E3D';

export const createCannonChargeStep = (charge: number): CanvasStep =>
  createConditionalStep(
    charge > 0,
    drawSave,
    createStyleStep({ fillStyle: CHARGE_COLOR }),
    drawBeginPath,
    createArcStep(BARREL_LENGTH - 1, 0, CHARGE_RADIUS * charge, 0, Math.PI * 2),
    drawFill,
    drawRestore,
  );
