import { floor } from 'lodash-es';
import { TILE_SIZE, isSpike, spikeTriangles, type Level } from '@mander/generator';
import { boxHitsTriangle } from './box-hits-triangle';
import { EPSILON } from './internal-constants';

export function overlapsSpike(
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number
): boolean {
  const firstTileX = floor(boxLeft / TILE_SIZE);
  const lastTileX = floor((boxLeft + boxWidth - EPSILON) / TILE_SIZE);
  const firstTileY = floor(boxTop / TILE_SIZE);
  const lastTileY = floor((boxTop + boxHeight - EPSILON) / TILE_SIZE);
  for (let tileY = firstTileY; tileY <= lastTileY; tileY++) {
    for (let tileX = firstTileX; tileX <= lastTileX; tileX++) {
      if (!isSpike(level, tileX, tileY)) continue;
      for (const triangle of spikeTriangles(tileX, tileY)) {
        if (boxHitsTriangle(boxLeft, boxTop, boxWidth, boxHeight, triangle)) return true;
      }
    }
  }
  return false;
}
