import { map } from 'lodash-es';
import { createFillRectStep } from '../../canvas/create-fill-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { ICE_GLINT } from '../consts';

const CRACKS: readonly number[][] = Object.freeze([
  [4, 10, 10, 1],
  [14, 10, 1, 7],
  [15, 17, 8, 1],
  [21, 3, 1, 7],
  [6, 21, 1, 6],
]);

const SHEEN: readonly number[][] = Object.freeze([
  [4, 24, 3, 2],
  [7, 21, 3, 2],
  [10, 18, 3, 2],
]);

const GLINTS: readonly number[][] = Object.freeze([
  [23, 6, 4, 1],
  [24, 5, 1, 3],
  [8, 13, 3, 1],
]);

const createRectsStep = (
  rects: readonly number[][],
  pixelX: number,
  pixelY: number,
): CanvasStep =>
  createSequenceStep(
    map(rects, ([offsetX, offsetY, width, height]) =>
      createFillRectStep(pixelX + offsetX, pixelY + offsetY, width, height),
    ),
  );

export const createIceStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: style.joint }),
    createRectsStep(CRACKS, pixelX, pixelY),
    createStyleStep({ fillStyle: style.highlight }),
    createRectsStep(SHEEN, pixelX, pixelY),
    createStyleStep({ fillStyle: ICE_GLINT }),
    createRectsStep(GLINTS, pixelX, pixelY),
  ]);
