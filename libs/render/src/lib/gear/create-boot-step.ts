import type { Point } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createEllipseStep } from '../canvas/create-ellipse-step';
import { createLineToStep } from '../canvas/create-line-to-step';
import { createLinearGradient } from '../canvas/create-linear-gradient';
import { createMoveToStep } from '../canvas/create-move-to-step';
import { createRoundRectStep } from '../canvas/create-round-rect-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawClosePath } from '../canvas/draw-close-path';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { outline } from '../stroke/outline';
import type { CanvasStep } from '../types/canvas-step';
import { CLOUD_LEATHER, CLOUD_PUFF, CLOUD_SOLE } from './consts';
import { computeGearCoordinate } from './internal/compute-gear-coordinate';
import type { BootPuff } from './internal/types/boot-puff';

const SILHOUETTE: readonly Point[] = [
  { x: 0.4, y: 0.14 },
  { x: 0.64, y: 0.14 },
  { x: 0.64, y: 0.5 },
  { x: 0.69, y: 0.59 },
  { x: 0.69, y: 0.7 },
  { x: 0.24, y: 0.7 },
  { x: 0.21, y: 0.62 },
  { x: 0.36, y: 0.51 },
  { x: 0.4, y: 0.43 },
];

const PUFFS: readonly BootPuff[] = [
  { x: 0.27, y: 0.81, wide: 0.15, tall: 0.09 },
  { x: 0.5, y: 0.85, wide: 0.19, tall: 0.11 },
  { x: 0.73, y: 0.8, wide: 0.14, tall: 0.08 },
];

export const createBootStep = (
  left: number,
  top: number,
  size: number,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createStyleStep({ fillStyle: CLOUD_PUFF }),
    drawBeginPath,
    ...map(PUFFS, (puff) =>
      createSequenceStep([
        createMoveToStep(
          computeGearCoordinate(left, size, puff.x + puff.wide),
          computeGearCoordinate(top, size, puff.y),
        ),
        createEllipseStep(
          computeGearCoordinate(left, size, puff.x),
          computeGearCoordinate(top, size, puff.y),
          size * puff.wide,
          size * puff.tall,
          0,
          0,
          Math.PI * 2,
        ),
      ]),
    ),
    drawFill,
    drawRestore,

    drawSave,
    drawBeginPath,
    ...map(SILHOUETTE, (point, index) =>
      match(index)
        .with(0, () =>
          createMoveToStep(
            computeGearCoordinate(left, size, point.x),
            computeGearCoordinate(top, size, point.y),
          ),
        )
        .otherwise(() =>
          createLineToStep(
            computeGearCoordinate(left, size, point.x),
            computeGearCoordinate(top, size, point.y),
          ),
        ),
    ),
    drawClosePath,
    outline(),
    createContextStyleStep((context) => ({
      fillStyle: createLinearGradient(
        context,
        computeGearCoordinate(left, size, 0.5),
        computeGearCoordinate(top, size, 0.14),
        computeGearCoordinate(left, size, 0.5),
        computeGearCoordinate(top, size, 0.7),
        [
          [0, CLOUD_LEATHER.light],
          [0.55, CLOUD_LEATHER.base],
          [1, CLOUD_LEATHER.deep],
        ],
      ),
    })),
    drawFill,
    drawRestore,

    createStyleStep({ fillStyle: CLOUD_SOLE }),
    drawBeginPath,
    createRoundRectStep(
      computeGearCoordinate(left, size, 0.2),
      computeGearCoordinate(top, size, 0.68),
      size * 0.51,
      size * 0.07,
      size * 0.03,
    ),
    outline(),
    drawFill,

    createStyleStep({ fillStyle: CLOUD_LEATHER.light }),
    drawBeginPath,
    createRoundRectStep(
      computeGearCoordinate(left, size, 0.37),
      computeGearCoordinate(top, size, 0.11),
      size * 0.3,
      size * 0.09,
      size * 0.04,
    ),
    outline(),
    drawFill,

    createStyleStep({ fillStyle: CLOUD_LEATHER.deep }),
    drawBeginPath,
    createRoundRectStep(
      computeGearCoordinate(left, size, 0.34),
      computeGearCoordinate(top, size, 0.5),
      size * 0.33,
      size * 0.06,
      size * 0.02,
    ),
    drawFill,
  ]);
