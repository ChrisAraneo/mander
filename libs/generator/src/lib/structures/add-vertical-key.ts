import { type Tile, TILE_KEY } from '@mander/model';
import { chain } from '@mander/utils';
import { floor, size, sortBy } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';
import { standTiles } from './stand-tiles';
import { type Spot, standingSpots } from './standing-spots';

const { nullish } = P;

const KEY_HEIGHT = 1;

const middleRow = (tiles: Tile[][]): number => floor(size(tiles) / 2);

const middleFirst = (spots: Spot[], middle: number): Spot[] =>
  sortBy(spots, (spot) => Math.abs(spot.row - middle));

export const addVerticalKey = (tiles: Tile[][]): Tile[][] =>
  chain(standingSpots(tiles, KEY_HEIGHT))
    .thru((spots) => middleFirst(spots, middleRow(tiles)))
    .head()
    .thru((spot) =>
      match(spot)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found) => standTiles(found, TILE_KEY, KEY_HEIGHT)),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
