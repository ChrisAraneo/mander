import { type Tile, TILE_CHEST, TILE_PORTAL } from '@mander/model';
import { chain } from '@mander/utils';
import { filter, findIndex, includes, sortBy } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';
import { standTiles } from './stand-tiles';
import { type Spot, standingSpots } from './standing-spots';

const { nullish } = P;

const CHEST_HEIGHT = 1;

const PORTAL_GAP = 2;

const NOT_FOUND = -1;

const anchorRow = (tiles: Tile[][]): number =>
  chain(findIndex(tiles, (cells) => includes(cells, TILE_PORTAL)))
    .thru((row) =>
      match(row)
        .with(NOT_FOUND, () => 0)
        .otherwise((found) => found),
    )
    .value();

const belowPortal = (spots: Spot[], anchor: number): Spot[] =>
  sortBy(
    filter(spots, (spot) => spot.row >= anchor + PORTAL_GAP),
    (spot) => spot.row,
  );

export const addVerticalChest = (tiles: Tile[][]): Tile[][] =>
  chain(standingSpots(tiles, CHEST_HEIGHT))
    .thru((spots) => belowPortal(spots, anchorRow(tiles)))
    .head()
    .thru((spot) =>
      match(spot)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found) => standTiles(found, TILE_CHEST, CHEST_HEIGHT)),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
