import { type Tile, TILE_AIR } from '@mander/model';
import { findLastIndex, last, map, size, some, times } from 'lodash-es';

const GROUND_DEPTH = 4;

const SKY_HEIGHT = 20;

const lowestFilledRow = (tiles: Tile[][]): number =>
  findLastIndex(tiles, (row) => some(row, (tile) => tile !== TILE_AIR));

const missingDepth = (tiles: Tile[][]): number => {
  const lowest = lowestFilledRow(tiles);

  if (lowest < 0) {
    return 0;
  }

  return Math.max(0, GROUND_DEPTH - (size(tiles) - 1 - lowest));
};

export const addPadding = (tiles: Tile[][]): Tile[][] => {
  if (size(tiles) === 0) {
    return [];
  }

  const floor = last(tiles) ?? [];
  const sky = times(SKY_HEIGHT, () => times(size(floor), (): Tile => TILE_AIR));
  const bedrock = times(missingDepth(tiles), () => [...floor]);

  return [...sky, ...map(tiles, (row) => [...row]), ...bedrock];
};
