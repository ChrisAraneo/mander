import { chain } from '@mander/model';
import { createArcStep } from '../../canvas/create-arc-step';
import { createLineToStep } from '../../canvas/create-line-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawClosePath } from '../../canvas/draw-close-path';
import type { CanvasStep } from '../../types/canvas-step';
import { HEART_TIP } from './consts';

const HEART_LIFT = 0.3;

export const createHeartPathStep = (
  centerX: number,
  centerY: number,
  lobe: number,
): CanvasStep =>
  chain(centerY - lobe * HEART_LIFT)
    .thru((shoulder) =>
      createSequenceStep([
        drawBeginPath,
        createArcStep(centerX - lobe, shoulder, lobe, Math.PI, 0),
        createArcStep(centerX + lobe, shoulder, lobe, Math.PI, 0),
        createLineToStep(centerX, shoulder + lobe * HEART_TIP),
        drawClosePath,
      ]),
    )
    .value();
