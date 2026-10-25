import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createLineToStep } from '../canvas/create-line-to-step';
import { createMoveToStep } from '../canvas/create-move-to-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawClosePath } from '../canvas/draw-close-path';
import { drawFill } from '../canvas/draw-fill';
import type { CanvasStep } from '../types/canvas-step';
import type { Viewport } from '../types/viewport';
import { computeHillPoint } from './internal/compute-hill-point';
import { computeHillStepsAcross } from './internal/compute-hill-steps-across';
import type { HillLayer } from './types/hill-layer';

export const createHillLayerStep = (
  cameraX: number,
  layer: HillLayer,
  color: string,
  viewport: Viewport,
): CanvasStep =>
  pipe(
    viewport.height * layer.baselineRatio,
    (baseline) =>
      map(computeHillStepsAcross(viewport.width), (screenX) =>
        computeHillPoint(screenX, cameraX, layer, baseline),
      ),
    (points) =>
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
  );
