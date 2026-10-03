import { type Tile, TILE_PORTAL } from '@mander/model';
import { findIndex, includes } from 'lodash-es';
import { match } from 'ts-pattern';

const NOT_FOUND = -1;

export const findAnchorRow = (tiles: Tile[][]): number =>
  match(findIndex(tiles, (cells) => includes(cells, TILE_PORTAL)))
    .with(NOT_FOUND, () => 0)
    .otherwise((row) => row);
