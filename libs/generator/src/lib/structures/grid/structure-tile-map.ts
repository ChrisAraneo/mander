import {
  type Level,
  type Palette,
  type Tile,
  TILE_AIR,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/engine';
import { head, map, size } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { isBlockCell, SPIKE, SPIKE_CEILING, type Structure } from '../types';
import { cellMaterial } from './cell-material';

const tileFor = (cell: number): Tile =>
  match(cell)
    .with(SPIKE, (): Tile => TILE_SPIKE)
    .with(SPIKE_CEILING, (): Tile => TILE_SPIKE_CEILING)
    .with(P.when(isBlockCell), (block): Tile => cellMaterial(block))
    .otherwise((): Tile => TILE_AIR);

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
