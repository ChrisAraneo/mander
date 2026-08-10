import { some } from 'lodash-es';

import {
  computeSpikeTriangles,
  isSpike,
  spikeOrientation,
  spikeShape,
  type Level,
} from '@mander/model';
import { boxHitsTriangle } from '../collision/box-hits-triangle';
import { tileRange } from '../collision/tile-range';

export const overlapsSpike = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  some(tileRange(boxTop, boxHeight), (tileY) =>
    some(
      tileRange(boxLeft, boxWidth),
      (tileX) =>
        isSpike(level, tileX, tileY) &&
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
