import { type Tile, TILE_AIR } from '@mander/model';
import { findLastIndex, some } from 'lodash-es';

export const findLowestFilledRow = ({
  tiles,
  front,
}: {
  tiles: Tile[][];
  front: Tile[][];
}) => ({
  tiles,
  front,
  lowest: findLastIndex(front, (row) => some(row, (tile) => tile !== TILE_AIR)),
});
