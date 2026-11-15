import {
  computeSpikeTriangles,
  getSpikeOrientation,
  getSpikeShape,
  type Level,
  type Point,
  TILE_SIZE,
  type Triangle,
} from '@mander/model';

export const computeTileSpikeTriangles = (
  level: Level,
  tile: Point,
): Triangle[] =>
  computeSpikeTriangles(
    tile.x * TILE_SIZE,
    tile.y * TILE_SIZE,
    getSpikeOrientation(level, tile.x, tile.y),
    getSpikeShape(level, tile.x, tile.y),
  );
