import { PLAYER_HEIGHT_TILES } from '@mander/engine';
import { type Tile, TILE_SPAWN } from '@mander/model';
import { chain } from '@mander/utils';
import { ceil, floor, size, sortBy } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';
import { standTiles } from './stand-tiles';
import { type Spot, standingSpots } from './standing-spots';

const { nullish } = P;

const SPAWN_HEIGHT = 2;

const SPAWN_CLEARANCE = SPAWN_HEIGHT + ceil(PLAYER_HEIGHT_TILES);

const middleColumn = (tiles: Tile[][]): number =>
  floor(size(tiles[0] ?? []) / 2);

const roomySpots = (tiles: Tile[][]): Spot[] =>
  match(standingSpots(tiles, SPAWN_CLEARANCE))
    .with([], () => standingSpots(tiles, SPAWN_HEIGHT))
    .otherwise((roomy) => roomy);

const lowestFirst = (spots: Spot[], middle: number): Spot[] =>
  sortBy(spots, [
    (spot) => -spot.row,
    (spot) => Math.abs(spot.column - middle),
  ]);

export const addVerticalSpawn = (tiles: Tile[][]): Tile[][] =>
  chain(roomySpots(tiles))
    .thru((spots) => lowestFirst(spots, middleColumn(tiles)))
    .head()
    .thru((spot) =>
      match(spot)
        .with(nullish, (): TilePatch[] => [])
        .otherwise((found) => standTiles(found, TILE_SPAWN, SPAWN_HEIGHT)),
    )
    .thru((patches) => patchTiles(tiles, patches))
    .value();
