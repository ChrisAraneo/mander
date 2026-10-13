import { type Tile, TILE_PORTAL } from '@mander/model';
import { find, includes, indexOf, size } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { nullish } = P;

export const findAnchorColumn = (tiles: Tile[][]): number =>
  match(find(tiles, (cells) => includes(cells, TILE_PORTAL)))
    .with(nullish, () => size(tiles[0]) - 1)
    .otherwise((cells) => indexOf(cells, TILE_PORTAL));
