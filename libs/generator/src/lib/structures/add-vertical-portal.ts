import { type Tile, TILE_PORTAL } from '@mander/model';
import { chain } from '@mander/utils';
import { floor, size, sortBy } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';
import { standTiles } from './stand-tiles';
import { type Spot, standingSpots } from './standing-spots';

const { nullish } = P;

const PORTAL_HEIGHT = 2;

const middleColumn = (tiles: Tile[][]): number =>
  floor(size(tiles[0] ?? []) / 2);

const highestFirst = (spots: Spot[], middle: number): Spot[] =>
  sortBy(spots, [(spot) => spot.row, (spot) => Math.abs(spot.column - middle)]);

export const addVerticalPortal = (tiles: Tile[][]): Tile[][] =>
  chain(standingSpots(tiles, PORTAL_HEIGHT))
    .thru((spots) => highestFirst(spots, middleColumn(tiles)))
    .head()
    .thru((spot) =>
      match(spot)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found) => standTiles(found, TILE_PORTAL, PORTAL_HEIGHT)),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
