import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_DIRT,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import { flatten, includes, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { removeCannons } from './remove-cannons';

const FIRST_ARMED_LEVEL = 5;

const createEmplacement = (): Tile[][] => [
  [TILE_AIR, TILE_CANNON, TILE_AIR, TILE_SPIKE],
  [TILE_DIRT, TILE_DIRT, TILE_CANNON, TILE_DIRT],
];

describe('removeCannons', () => {
  it('should fill every cannon in when the level is before the fifth', () => {
    times(FIRST_ARMED_LEVEL - 1, (index) => {
      const levelNumber = index + 1;

      expect(
        includes(
          flatten(removeCannons(createEmplacement(), levelNumber)),
          TILE_CANNON,
        ),
        `level ${levelNumber} still armed`,
      ).toBe(false);
    });
  });

  it('should leave the cannons standing when the level is the fifth or later', () => {
    times(4, (index) => {
      const levelNumber = FIRST_ARMED_LEVEL + index;

      expect(
        removeCannons(createEmplacement(), levelNumber),
        `level ${levelNumber}`,
      ).toEqual(createEmplacement());
    });
  });

  it('should hand the cannon spot over to the blocks when they stand around it', () => {
    expect(removeCannons(createEmplacement(), 1)).toEqual([
      [TILE_AIR, TILE_DIRT, TILE_AIR, TILE_SPIKE],
      [TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should never hand the spot over to a cannon when one stands next door', () => {
    expect(
      removeCannons(
        [
          [TILE_CANNON, TILE_CANNON],
          [TILE_BRICK, TILE_CANNON],
        ],
        1,
      ),
    ).toEqual([
      [TILE_BRICK, TILE_BRICK],
      [TILE_BRICK, TILE_BRICK],
    ]);
  });

  it('should fall back to brick when no block stands anywhere near', () => {
    expect(
      removeCannons(
        [
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_CANNON, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
        ],
        1,
      )[1][1],
    ).toBe(TILE_BRICK);
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(removeCannons([], 1)).toEqual([]);
  });

  it('should not change the old grid when it clears the cannons', () => {
    const tiles = createEmplacement();

    removeCannons(tiles, 1);
    removeCannons(tiles, FIRST_ARMED_LEVEL);

    expect(tiles).toEqual(createEmplacement());
  });
});
