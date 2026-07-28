import {
  type Level,
  type Palette,
  type Tile,
  TILE_EMPTY,
  TILE_SOLID,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/engine';
import { head, map, size } from 'lodash-es';
import { match } from 'ts-pattern';

import { BLOCK, SPIKE, SPIKE_CEILING, type Structure } from '../types';

const tileFor = (cell: number): Tile =>
  match(cell)
    .with(BLOCK, (): Tile => TILE_SOLID)
    .with(SPIKE, (): Tile => TILE_SPIKE)
    .with(SPIKE_CEILING, (): Tile => TILE_SPIKE_CEILING)
    .otherwise((): Tile => TILE_EMPTY);

const EMPTY_PALETTE: Palette = {
  sky: ['', '', ''],
  hills: ['', ''],
  block: '',
  blockCap: '',
  blockCapHighlight: '',
};

export const structureTileMap = (grid: Structure): Level => ({
  seed: '',
  width: size(head(grid)),
  height: grid.length,
  tiles: map(grid, (cells) => map(cells, (cell) => tileFor(cell))),
  palette: EMPTY_PALETTE,
  chestItems: [],
  enemies: [],
});
