import { isSpike, type Level, type Point, type Rectangle } from '@mander/model';
import { some } from 'lodash-es';
import { isOverlappingTriangle } from '../../collision/is-overlapping-triangle';
import { computeTileSpikeTriangles } from './compute-tile-spike-triangles';

export const isHittingSpikeTile = (
  level: Level,
  box: Rectangle,
  tile: Point,
): boolean =>
  isSpike(level, tile.x, tile.y) &&
  some(computeTileSpikeTriangles(level, tile), (triangle) =>
    isOverlappingTriangle(triangle, box.x, box.y, box.width, box.height),
  );
