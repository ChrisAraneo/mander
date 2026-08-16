import { type Tile, TILE_AIR } from '@mander/model';
import { chain } from '@mander/utils';
import { findLastIndex, last, map, size, some, times } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { number } = P;

const GROUND_DEPTH = 4;

const SKY_HEIGHT = 20;

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

export const addPadding = (tiles: Tile[][]): Tile[][] =>
  match(tiles)
    .with([], (): Tile[][] => [])
    .otherwise(() =>
      chain(last(tiles) ?? [])
        .thru((floor) => ({
          sky: times(SKY_HEIGHT, () =>
            times(size(floor), (): Tile => TILE_AIR),
          ),
          bedrock: times(missingDepth(tiles), () => [...floor]),
        }))
        .thru(({ sky, bedrock }) => [
          ...sky,
          ...map(tiles, (row) => [...row]),
          ...bedrock,
        ])
        .value(),
    );
