import type { Tile } from '@mander/model';
import type { Cell } from '../types/cell';
import { filterCells } from './filter-cells';

export const filterTileCells = (tiles: Tile[][], tile: Tile): Cell[] =>
  filterCells(tiles, (cell) => cell === tile);
