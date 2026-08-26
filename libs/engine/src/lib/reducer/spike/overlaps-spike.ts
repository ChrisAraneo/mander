import { includes, some } from 'lodash-es';

import {
  computeSpikeTriangles,
  isSpike,
  getSpikeOrientation,
  type SpikeOrientation,
  getSpikeShape,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { boxHitsTriangle } from '../collision/box-hits-triangle';
import { tileRange } from '../collision/tile-range';

export const SPIKE_ORIENTATIONS: readonly SpikeOrientation[] = Object.freeze([
  'FLOOR',
  'CEILING',
]);

export const overlapsSpikeFacing = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
  orientations: readonly SpikeOrientation[],
): boolean =>
  some(tileRange(boxTop, boxHeight), (tileY) =>
    some(
      tileRange(boxLeft, boxWidth),
      (tileX) =>
        isSpike(level, tileX, tileY) &&
        includes(orientations, getSpikeOrientation(level, tileX, tileY)) &&
        some(
          computeSpikeTriangles(
            tileX * TILE_SIZE,
            tileY * TILE_SIZE,
            getSpikeOrientation(level, tileX, tileY),
            getSpikeShape(level, tileX, tileY),
          ),
          (triangle) =>
            boxHitsTriangle(boxLeft, boxTop, boxWidth, boxHeight, triangle),
        ),
    ),
  );

export const overlapsSpike = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  overlapsSpikeFacing(
    level,
    boxLeft,
    boxTop,
    boxWidth,
    boxHeight,
    SPIKE_ORIENTATIONS,
  );
