import type { TilePosition } from '../geometry/tile-position';
import type { Level } from './level';
import type { Tile } from './tile';

export const findTile = (level: Level, tile: Tile): TilePosition | null => {
  for (let y = level.height - 1; y >= 0; y--) {
    for (let x = 0; x < level.width; x++) {
      if (level.tiles[y][x] === tile) return { x, y };
    }
  }
  return null;
};
