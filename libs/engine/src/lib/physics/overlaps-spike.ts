import { isSpike, type Level, spikeTriangles } from '@mander/generator';
import { some } from 'lodash-es';

import { boxHitsTriangle } from './box-hits-triangle';
import { tileRange } from './tile-range';

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
        some(spikeTriangles(tileX, tileY), (triangle) =>
          boxHitsTriangle(boxLeft, boxTop, boxWidth, boxHeight, triangle),
        ),
    ),
  );
