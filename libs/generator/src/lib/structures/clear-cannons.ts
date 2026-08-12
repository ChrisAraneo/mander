import { type Tile, TILE_BRICK, TILE_CANNON } from '@mander/model';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

export const FIRST_CANNON_LEVEL = 5;

const bricked = (tile: Tile): Tile =>
  match(tile === TILE_CANNON)
    .with(true, () => TILE_BRICK)
    .otherwise(() => tile);

export const clearCannons = (tiles: Tile[][], levelNumber: number): Tile[][] =>
  match(levelNumber >= FIRST_CANNON_LEVEL)
    .with(true, () => map(tiles, (row) => [...row]))
    .otherwise(() => map(tiles, (row) => map(row, bricked)));
