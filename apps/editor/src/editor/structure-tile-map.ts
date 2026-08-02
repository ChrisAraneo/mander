import { type Level, type Tile, TILE_AIR } from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';
import { head, includes, map, size } from 'lodash-es';

/**
 * A grid already holds the game's own tile values, so the map is all but a
 * copy. Markers are the exception and come out as air: they are a note to the
 * generator that the player never sees. The enemy tile stays where it is —
 * nothing draws it as a block, and it is what the spawns are read back out of,
 * exactly as in a generated level.
 */
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
