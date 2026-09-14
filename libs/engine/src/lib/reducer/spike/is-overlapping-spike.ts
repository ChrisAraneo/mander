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
import { isBoxHittingTriangle } from '../collision/is-box-hitting-triangle';
import { getTileRange } from '../collision/get-tile-range';

export const SPIKE_ORIENTATIONS: readonly SpikeOrientation[] = Object.freeze([
  'FLOOR',
  'CEILING',
]);

export const isOverlappingSpikeFacing = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
  orientations: readonly SpikeOrientation[],
): boolean =>
  some(getTileRange(boxTop, boxHeight), (tileY) =>
    some(
      getTileRange(boxLeft, boxWidth),
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
            isBoxHittingTriangle(
              boxLeft,
              boxTop,
              boxWidth,
              boxHeight,
              triangle,
            ),
        ),
    ),
  );

export const isOverlappingSpike = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  isOverlappingSpikeFacing(
    level,
    boxLeft,
    boxTop,
    boxWidth,
    boxHeight,
    SPIKE_ORIENTATIONS,
  );
