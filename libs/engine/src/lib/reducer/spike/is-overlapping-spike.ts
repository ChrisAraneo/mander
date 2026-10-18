import {
  computeSpikeTriangles,
  getSpikeOrientation,
  getSpikeShape,
  isSpike,
  type Level,
  TILE_SIZE,
} from '@mander/model';
import { some } from 'lodash-es';
import { computeTileRange } from '../collision/compute-tile-range';
import { isBoxHittingTriangle } from '../collision/is-box-hitting-triangle';

export const isOverlappingSpike = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  some(computeTileRange(boxTop, boxHeight), (tileY) =>
    some(
      computeTileRange(boxLeft, boxWidth),
      (tileX) =>
        isSpike(level, tileX, tileY) &&
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
