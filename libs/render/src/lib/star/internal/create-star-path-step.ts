import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { createLineToStep } from '../../canvas/create-line-to-step';
import { createMoveToStep } from '../../canvas/create-move-to-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawClosePath } from '../../canvas/draw-close-path';
import type { CanvasStep } from '../../types/canvas-step';
import { computeStarArmPoints } from './compute-star-arm-points';

export const createStarPathStep = (
  centerX: number,
  centerY: number,
  radius: number,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    ...map(computeStarArmPoints(centerX, centerY, radius), (point, index) =>
      match(index === 0)
        .with(true, () => createMoveToStep(point.x, point.y))
        .otherwise(() => createLineToStep(point.x, point.y)),
    ),
    drawClosePath,
  ]);
