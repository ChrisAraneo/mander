import { includes, some } from 'lodash-es';

import {
  computeSpikeTriangles,
  isSpike,
  spikeOrientation,
  type SpikeOrientation,
  spikeShape,
  type Level,
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
        includes(orientations, spikeOrientation(level, tileX, tileY)) &&
        some(
          computeSpikeTriangles(
            tileX,
            tileY,
            spikeOrientation(level, tileX, tileY),
            spikeShape(level, tileX, tileY),
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
