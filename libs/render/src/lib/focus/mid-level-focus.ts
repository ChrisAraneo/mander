import { isSolidTile, type Level, type Tile, TILE_SIZE } from '@mander/engine';
import { filter, findIndex, size } from 'lodash-es';

import type { Focus } from './focus';

const isFloor = (row: Tile[]): boolean =>
  size(filter(row, isSolidTile)) * 2 > size(row);

const floorRow = (level: Level): number => {
  const found = findIndex(level.tiles, isFloor);

  return found >= 0 ? found : level.height / 2;
};

export const midLevelFocus = (level: Level): Focus => ({
  x: (level.width * TILE_SIZE) / 2,
  y: floorRow(level) * TILE_SIZE,
});
