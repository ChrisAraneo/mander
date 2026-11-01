import { map } from 'lodash-es';
import { createArcStep } from '../../canvas/create-arc-step';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { drawRestore } from '../../canvas/draw-restore';
import { drawSave } from '../../canvas/draw-save';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { HALF_TILE } from './consts';

const ORB_RADIUS = 4;

const VEINS: readonly number[][] = [
  [4, 5, 8, 2],
  [18, 4, 10, 2],
  [3, 15, 6, 2],
  [20, 19, 9, 2],
  [10, 6, 2, 7],
  [21, 9, 2, 9],
];

export const createOrbTileStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
  vein: string,
  core: string,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createStyleStep({ fillStyle: style.joint }),
    createSequenceStep(
      map(VEINS, ([offsetX, offsetY, width, height]) =>
        createFillRectStep(
          pixelX + offsetX,
          pixelY + offsetY + 1,
          width,
          height,
        ),
      ),
    ),
    createStyleStep({ fillStyle: vein }),
    createSequenceStep(
      map(VEINS, ([offsetX, offsetY, width, height]) =>
        createFillRectStep(pixelX + offsetX, pixelY + offsetY, width, height),
      ),
    ),
    createStyleStep({ fillStyle: core }),
    drawBeginPath,
    createArcStep(
      pixelX + HALF_TILE,
      pixelY + HALF_TILE,
      ORB_RADIUS,
      0,
      Math.PI * 2,
    ),
    drawFill,
    drawRestore,
  ]);
