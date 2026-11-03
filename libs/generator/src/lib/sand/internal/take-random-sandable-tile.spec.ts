import { createRandom } from '@mander/engine';
import {
  type Tile,
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_ICE,
  TILE_SPIKE,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { map, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { takeRandomSandableTile } from './take-random-sandable-tile';

const SEEDS = times(200, (day) => `DAY-${day}`);

const TILES: Tile[][] = [
  [TILE_AIR, TILE_DIRT, TILE_BRICK],
  [TILE_STONE, TILE_WOOD, TILE_CERAMIC],
];

const takeAll = (tiles: Tile[][]): (Tile | undefined)[] =>
  uniq(map(SEEDS, (seed) => takeRandomSandableTile(tiles, createRandom(seed))));

describe('takeRandomSandableTile', () => {
  it('should take every kind of block across other seeds when the level holds them all', () => {
    expect(takeAll(TILES).sort()).toEqual(
      [TILE_DIRT, TILE_BRICK, TILE_STONE, TILE_WOOD, TILE_CERAMIC].sort(),
    );
  });

  it('should only take a kind of block that the level holds when some kinds are missing', () => {
    expect(takeAll([[TILE_AIR, TILE_WOOD]])).toEqual([TILE_WOOD]);
  });

  it('should never take a hazard or a seasonal block when the level holds them', () => {
    expect(
      takeAll([[TILE_CANNON, TILE_FIREBALL, TILE_ICE, TILE_SPIKE, TILE_STONE]]),
    ).toEqual([TILE_STONE]);
  });

  it('should take nothing when the level holds no blocks', () => {
    expect(takeAll([[TILE_AIR, TILE_SPIKE]])).toEqual([undefined]);
  });

  it('should take nothing when the level is empty', () => {
    expect(takeRandomSandableTile([], createRandom('DAY-1'))).toBeUndefined();
  });

  it('should take the same kind of block when it starts from the same seed', () => {
    expect(takeRandomSandableTile(TILES, createRandom('DAY-1'))).toBe(
      takeRandomSandableTile(TILES, createRandom('DAY-1')),
    );
  });
});
