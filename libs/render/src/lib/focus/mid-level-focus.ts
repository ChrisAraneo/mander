import { isSolidTile, type Level, type Tile, TILE_SIZE } from '@mander/engine';
import { filter, findIndex, size } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Focus } from './focus';

const NOT_FOUND = -1;

const isFloor = (row: Tile[]): boolean =>
  size(filter(row, isSolidTile)) * 2 > size(row);

const floorRow = (level: Level): number =>
  match(findIndex(level.tiles, isFloor))
    .with(NOT_FOUND, () => level.height / 2)
    .otherwise((found) => found);

export const midLevelFocus = (level: Level): Focus => ({
  x: (level.width * TILE_SIZE) / 2,
  y: floorRow(level) * TILE_SIZE,
});
