import {
  type Tile,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SPIKE,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { flatten, includes, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../consts';
import { removeFireballs } from './remove-fireballs';

const FIRST_LIT_LEVEL = 4;

const createForge = (): Tile[][] => [
  [TILE_AIR, TILE_STONE, TILE_AIR, TILE_SPIKE],
  [TILE_DIRT, TILE_FIREBALL, TILE_WOOD, TILE_DIRT],
];

describe('removeFireballs', () => {
  it('should put every fireball out when the level is before the fourth', () => {
    times(FIRST_LIT_LEVEL - 1, (index) => {
      const levelNumber = index + 1;

      expect(
        includes(
          flatten(removeFireballs(createForge(), levelNumber)),
          TILE_FIREBALL,
        ),
        `level ${levelNumber} still burns`,
      ).toBe(false);
    });
  });

  it('should leave the fireballs burning when the level is the fourth through the eighth', () => {
    times(LEVELS_PER_DAY - FIRST_LIT_LEVEL + 1, (index) => {
      const levelNumber = FIRST_LIT_LEVEL + index;

      expect(
        removeFireballs(createForge(), levelNumber),
        `level ${levelNumber}`,
      ).toEqual(createForge());
    });
  });

  it('should hand the fireball spot over to the blocks when they stand around it', () => {
    expect(removeFireballs(createForge(), 1)).toEqual([
      [TILE_AIR, TILE_STONE, TILE_AIR, TILE_SPIKE],
      [TILE_DIRT, TILE_STONE, TILE_WOOD, TILE_DIRT],
    ]);
  });

  it('should take the block that shows up most often when several stand around the spot', () => {
    expect(
      removeFireballs(
        [
          [TILE_AIR, TILE_STONE, TILE_AIR],
          [TILE_DIRT, TILE_FIREBALL, TILE_DIRT],
          [TILE_AIR, TILE_DIRT, TILE_AIR],
        ],
        1,
      )[1][1],
    ).toBe(TILE_DIRT);
  });

  it('should take the block beside the spot when no block sits above or below it', () => {
    expect(
      removeFireballs(
        [
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_WOOD, TILE_FIREBALL, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
        ],
        1,
      )[1][1],
    ).toBe(TILE_WOOD);
  });

  it('should never hand the spot over to a fireball when one stands next door', () => {
    expect(
      removeFireballs(
        [
          [TILE_AIR, TILE_FIREBALL, TILE_AIR],
          [TILE_AIR, TILE_FIREBALL, TILE_AIR],
          [TILE_AIR, TILE_DIRT, TILE_AIR],
        ],
        1,
      ),
    ).toEqual([
      [TILE_AIR, TILE_BRICK, TILE_AIR],
      [TILE_AIR, TILE_DIRT, TILE_AIR],
      [TILE_AIR, TILE_DIRT, TILE_AIR],
    ]);
  });

  it('should fall back to brick when no block stands anywhere near', () => {
    expect(
      removeFireballs(
        [
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_FIREBALL, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
        ],
        1,
      )[1][1],
    ).toBe(TILE_BRICK);
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(removeFireballs([], 1)).toEqual([]);
  });

  it('should not change the old grid when it puts the fireballs out', () => {
    const tiles = createForge();

    removeFireballs(tiles, 1);
    removeFireballs(tiles, FIRST_LIT_LEVEL);

    expect(tiles).toEqual(createForge());
  });
});
