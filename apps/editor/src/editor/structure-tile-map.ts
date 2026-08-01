import {
  type Level,
  type Palette,
  type Tile,
  TILE_AIR,
  TILE_ENEMY,
} from '@mander/model';
import { STRUCTURE_START, STRUCTURE_END } from '@mander/structures';
import { head, includes, map, size } from 'lodash-es';

/**
 * A grid already holds the game's own tile values, so the map is all but a
 * copy. The exceptions come out as air: an enemy stands on the block below and
 * is drawn on top rather than being a tile, and a marker is a note to the
 * generator that the player never sees.
 */
const NOT_DRAWN = [TILE_ENEMY, STRUCTURE_START, STRUCTURE_END];

const EMPTY_PALETTE: Palette = {
  sky: ['', '', ''],
  hills: ['', ''],
  block: '',
  blockCap: '',
  blockCapHighlight: '',
};

export const structureTileMap = (grid: number[][]): Level => ({
  seed: '',
  width: size(head(grid)),
  height: size(grid),
  tiles: map(grid, (cells) =>
    map(cells, (cell): Tile => (includes(NOT_DRAWN, cell) ? TILE_AIR : cell)),
  ),
  palette: EMPTY_PALETTE,
  chestItems: [],
  enemies: [],
});
