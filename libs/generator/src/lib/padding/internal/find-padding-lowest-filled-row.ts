import { type Tile, TILE_AIR } from '@mander/model';
import { findLastIndex, some } from 'lodash-es';
import type { PaddingLowestRow } from './types/padding-lowest-row';

export const findPaddingLowestFilledRow = ({
  tiles,
  front,
}: {
  tiles: Tile[][];
  front: Tile[][];
}): PaddingLowestRow => ({
  tiles,
  front,
  lowest: findLastIndex(front, (row) => some(row, (tile) => tile !== TILE_AIR)),
});
