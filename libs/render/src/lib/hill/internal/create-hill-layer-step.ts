import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawClosePath } from '../../canvas/draw-close-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';
import type { Viewport } from '../../types/viewport';
import type { HillLayer } from '../types/hill-layer';
import { computeHillPoint } from './compute-hill-point';
import { computeHillStepsAcross } from './compute-hill-steps-across';

export const createHillLayerStep = (
  cameraX: number,
  layer: HillLayer,
  color: string,
  viewport: Viewport,
): CanvasStep =>
  chain(viewport.height * layer.baselineRatio)
    .thru((baseline) =>
      map(computeHillStepsAcross(viewport.width), (screenX) =>
        computeHillPoint(screenX, cameraX, layer, baseline),
      ),
    )
    .thru((points) =>
      createSequenceStep([
        createStyleStep({ fillStyle: color }),
        drawBeginPath,
        createMoveToStep(0, viewport.height),
        createSequenceStep(
          map(points, (point) => createLineToStep(point.x, point.y)),
        ),
        createLineToStep(viewport.width, viewport.height),
        drawClosePath,
        drawFill,
      ]),
    )
    .value();
