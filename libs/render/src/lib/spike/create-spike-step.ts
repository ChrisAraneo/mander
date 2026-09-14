import { chain } from '@mander/utils';
import {
  computeSpikeTriangles,
  type Level,
  getSpikeOrientation,
  getSpikeShape,
  TILE_SIZE,
} from '@mander/model';
import type { Triangle } from '@mander/utils';
import { map } from 'lodash-es';

import {
  beginPath,
  type CanvasStep,
  closePath,
  type ColorStop,
  fill,
  traceLineTo,
  createLinearGradient,
  moveTo,
  sequence,
  applyStyleWith,
} from '../canvas';
import { outline } from '../stroke';

const SPIKE_STOPS: readonly ColorStop[] = [
  [0, '#8B90A3'],
  [1, '#DFE3EE'],
];

export const createProngStep = (
  [left, apex, right]: Triangle,
  stops: readonly ColorStop[] = SPIKE_STOPS,
): CanvasStep =>
  sequence([
    beginPath,
    moveTo(left.x, left.y),
    traceLineTo(apex.x, apex.y),
    traceLineTo(right.x, right.y),
    closePath,
    outline(),
    applyStyleWith((context) => ({
      fillStyle: createLinearGradient(
        context,
        left.x,
        left.y,
        left.x,
        apex.y,
        stops,
      ),
    })),
    fill,
  ]);

export const createSpikeStep = (
  level: Level,
  tileX: number,
  tileY: number,
): CanvasStep =>
  chain(
    computeSpikeTriangles(
      tileX * TILE_SIZE,
      tileY * TILE_SIZE,
      getSpikeOrientation(level, tileX, tileY),
      getSpikeShape(level, tileX, tileY),
    ),
  )
    .thru((triangles) =>
      map(triangles, (triangle) => createProngStep(triangle)),
    )
    .thru(sequence)
    .value();
