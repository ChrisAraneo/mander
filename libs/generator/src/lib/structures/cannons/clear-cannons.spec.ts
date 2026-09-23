import {
  type Tile,
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import { flatten, includes, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_CANNON_LEVEL } from '../../consts';
import { clearCannons } from './clear-cannons';

const emplacement = (): Tile[][] => [
  [TILE_AIR, TILE_CANNON, TILE_AIR, TILE_SPIKE],
  [TILE_DIRT, TILE_DIRT, TILE_CANNON, TILE_DIRT],
];

describe('clearCannons', () => {
  it('should fill every cannon in when the level is before the fifth', () => {
    times(FIRST_CANNON_LEVEL - 1, (index) => {
      const cleared = clearCannons(emplacement(), index + 1);

      expect(
        includes(flatten(cleared), TILE_CANNON),
        `level ${index + 1} still armed`,
      ).toBe(false);
    });
  });

  it('should leave the cannons standing when the level is the fifth or later', () => {
    times(4, (index) => {
      const level = FIRST_CANNON_LEVEL + index;

      expect(clearCannons(emplacement(), level), `level ${level}`).toEqual(
        emplacement(),
      );
    });
  });

  it('should hand the cannon spot over to the blocks when they stand around it', () => {
    expect(clearCannons(emplacement(), 1)).toEqual([
      [TILE_AIR, TILE_DIRT, TILE_AIR, TILE_SPIKE],
      [TILE_DIRT, TILE_DIRT, TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should never hand the spot over to a cannon when one stands next door', () => {
    expect(
      clearCannons(
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
      clearCannons(
        [
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_CANNON, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
        ],
        1,
      )[1][1],
    ).toBe(TILE_BRICK);
  });

  it('should hand back a grid of its own when it is given one to clear', () => {
    const tiles = emplacement();

    clearCannons(tiles, 1);
    clearCannons(tiles, FIRST_CANNON_LEVEL);

    expect(tiles).toEqual(emplacement());
  });
});
