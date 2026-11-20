import type { Random } from '@mander/common';
import { type Tile, TILE_CANNON } from '@mander/model';
import { filterTileCells } from '../../structures/filter-tile-cells';
import type { TripleCannonCells } from './types/triple-cannon-cells';

export const filterTripleCannonCells = ({
  tiles,
  random,
}: {
  tiles: Tile[][];
  random: Random;
}): TripleCannonCells => ({
  tiles,
  random,
  cells: filterTileCells(tiles, TILE_CANNON),
});
