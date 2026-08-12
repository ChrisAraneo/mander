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

import { clearCannons, FIRST_CANNON_LEVEL } from './clear-cannons';

const emplacement = (): Tile[][] => [
  [TILE_AIR, TILE_CANNON, TILE_AIR, TILE_SPIKE],
  [TILE_DIRT, TILE_DIRT, TILE_CANNON, TILE_DIRT],
];

describe('clearCannons', () => {
  it('bricks over every cannon on the levels before the fifth', () => {
    times(FIRST_CANNON_LEVEL - 1, (index) => {
      const cleared = clearCannons(emplacement(), index + 1);

      expect(
        includes(flatten(cleared), TILE_CANNON),
        `level ${index + 1} still armed`,
      ).toBe(false);
      expect(cleared[0][1]).toBe(TILE_BRICK);
      expect(cleared[1][2]).toBe(TILE_BRICK);
    });
  });

  it('leaves the cannons standing from the fifth level on', () => {
    times(4, (index) => {
      const level = FIRST_CANNON_LEVEL + index;

      expect(clearCannons(emplacement(), level), `level ${level}`).toEqual(
        emplacement(),
      );
    });
  });

  it('touches nothing else on its way through', () => {
    expect(clearCannons(emplacement(), 1)).toEqual([
      [TILE_AIR, TILE_BRICK, TILE_AIR, TILE_SPIKE],
      [TILE_DIRT, TILE_DIRT, TILE_BRICK, TILE_DIRT],
    ]);
  });

  it('hands back a grid of its own rather than the one it was given', () => {
    const tiles = emplacement();

    clearCannons(tiles, 1);
    clearCannons(tiles, FIRST_CANNON_LEVEL);

    expect(tiles).toEqual(emplacement());
  });
});
