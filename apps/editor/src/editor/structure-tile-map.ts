import { type Level, type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';
import { head, includes, map, size } from 'lodash-es';

const NOT_DRAWN = [STRUCTURE_START, STRUCTURE_END];

export const structureTileMap = (grid: number[][]): Level => ({
  seed: '',
  width: size(head(grid)),
  height: size(grid),
  tiles: map(grid, (cells) =>
    map(cells, (cell): Tile => (includes(NOT_DRAWN, cell) ? TILE_AIR : cell)),
  ),
  chestItems: [],
});
