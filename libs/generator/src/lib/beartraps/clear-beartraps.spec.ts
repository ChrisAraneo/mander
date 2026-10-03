import { type Tile, TILE_AIR, TILE_BEARTRAP, TILE_DIRT } from '@mander/model';
import { createRandom } from '@mander/utils';
import { filter, flatten, map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../consts';
import { clearBeartraps } from './clear-beartraps';

const SEED = 'DAY-1';

const JAWS = 200;

const FIRST_UNTOUCHED_LEVEL = 4;

const createTrapline = (): Tile[][] => [
  times(JAWS, (): Tile => TILE_BEARTRAP),
  times(JAWS, (): Tile => TILE_DIRT),
];

const createDen = (): Tile[][] => [
  [TILE_AIR, TILE_BEARTRAP, TILE_AIR, TILE_BEARTRAP],
  [TILE_AIR, TILE_AIR, TILE_BEARTRAP, TILE_AIR],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const countTraps = (tiles: Tile[][]): number =>
  size(filter(flatten(tiles), (tile) => tile === TILE_BEARTRAP));

const countTrapsLeft = (levelNumber: number): number =>
  countTraps(clearBeartraps(createTrapline(), levelNumber, createRandom(SEED)));

describe('clearBeartraps', () => {
  it('should set no jaws of its own when it thins any level', () => {
    times(LEVELS_PER_DAY, (index) => {
      const levelNumber = index + 1;

      expect(
        countTraps(
          clearBeartraps(createDen(), levelNumber, createRandom(SEED)),
        ),
        `level ${levelNumber}`,
      ).toBeLessThanOrEqual(countTraps(createDen()));
    });
  });

  it('should pull the share the level was promised when it thins one', () => {
    expect(countTrapsLeft(1)).toBe(JAWS * 0.5);
    expect(countTrapsLeft(2)).toBe(JAWS * 0.65);
    expect(countTrapsLeft(3)).toBe(JAWS * 0.8);
  });

  it('should leave every trap set when the level is the fourth or later', () => {
    times(4, (index) => {
      const levelNumber = FIRST_UNTOUCHED_LEVEL + index;

      expect(
        clearBeartraps(createDen(), levelNumber, createRandom(SEED)),
        `level ${levelNumber}`,
      ).toEqual(createDen());
      expect(countTrapsLeft(levelNumber)).toBe(JAWS);
    });
  });

  it('should thin the level the same way when the generator starts from the same seed', () => {
    times(3, (index) => {
      const levelNumber = index + 1;

      expect(
        clearBeartraps(createTrapline(), levelNumber, createRandom(SEED)),
      ).toEqual(
        clearBeartraps(createTrapline(), levelNumber, createRandom(SEED)),
      );
    });
  });

  it('should thin the level another way when the generator starts from another seed', () => {
    expect(
      clearBeartraps(createTrapline(), 1, createRandom('DAY-1'))[0],
    ).not.toEqual(
      clearBeartraps(createTrapline(), 1, createRandom('DAY-2'))[0],
    );
  });

  it('should leave air behind and nothing else touched when it lifts a trap', () => {
    const lifted = clearBeartraps(createDen(), 1, createRandom(SEED));

    expect(map(lifted[0], (tile) => tile === TILE_DIRT)).toEqual([
      false,
      false,
      false,
      false,
    ]);
    expect(lifted[2]).toEqual([TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT]);
    expect(
      filter(
        flatten(lifted),
        (tile) => tile !== TILE_AIR && tile !== TILE_DIRT,
      ),
    ).toEqual(times(countTraps(lifted), (): Tile => TILE_BEARTRAP));
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(clearBeartraps([], 1, createRandom(SEED))).toEqual([]);
  });

  it('should not change the old grid when it thins the traps', () => {
    const tiles = createDen();

    clearBeartraps(tiles, 1, createRandom(SEED));
    clearBeartraps(tiles, FIRST_UNTOUCHED_LEVEL, createRandom(SEED));

    expect(tiles).toEqual(createDen());
  });
});
