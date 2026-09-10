import { type Tile, TILE_AIR } from '@mander/model';
import { chain } from '@mander/utils';
import { findLastIndex, last, map, size, some, times } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { number } = P;

const GROUND_DEPTH = 4;

const SKY_HEIGHT = 20;

export interface Padding {
  sky: number;
  depth: number;
}

const lowestFilledRow = (tiles: Tile[][]): number =>
  findLastIndex(tiles, (row) => some(row, (tile) => tile !== TILE_AIR));

const missingDepth = (tiles: Tile[][]): number =>
  chain(lowestFilledRow(tiles))
    .thru((lowest) =>
      match(lowest)
        .with(number.lt(0), () => 0)
        .otherwise((row) =>
          Math.max(0, GROUND_DEPTH - (size(tiles) - 1 - row)),
        ),
    )
    .value();

export const paddingOf = (tiles: Tile[][]): Padding => ({
  sky: SKY_HEIGHT,
  depth: missingDepth(tiles),
});

// measured once off the front layer and applied to both, so the two layers of
// a level stay the same shape
export const padTiles = (tiles: Tile[][], padding: Padding): Tile[][] =>
  match(tiles)
    .with([], (): Tile[][] => [])
    .otherwise(() =>
      chain(last(tiles) ?? [])
        .thru((floor) => ({
          sky: times(padding.sky, () =>
            times(size(floor), (): Tile => TILE_AIR),
          ),
          bedrock: times(padding.depth, () => [...floor]),
        }))
        .thru(({ sky, bedrock }) => [
          ...sky,
          ...map(tiles, (row) => [...row]),
          ...bedrock,
        ])
        .value(),
    );

export const addPadding = (tiles: Tile[][]): Tile[][] =>
  padTiles(tiles, paddingOf(tiles));
