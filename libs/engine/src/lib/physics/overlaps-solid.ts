import { floor } from 'lodash-es';
import { TILE_SIZE, isSolid, type Level } from '@mander/generator';
import { EPSILON } from './internal-constants';

export function overlapsSolid(
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
      if (isSolid(level, tileX, tileY)) return true;
    }
  }
  return false;
}
