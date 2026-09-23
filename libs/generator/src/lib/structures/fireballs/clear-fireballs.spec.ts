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
import { flatten, includes, range, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_FIREBALL_LEVEL, LAST_FIREBALL_LEVEL } from '../../consts';
import { clearFireballs } from './clear-fireballs';

const forge = (): Tile[][] => [
  [TILE_AIR, TILE_STONE, TILE_AIR, TILE_SPIKE],
  [TILE_DIRT, TILE_FIREBALL, TILE_WOOD, TILE_DIRT],
];

describe('clearFireballs', () => {
  it('should put every fireball out when the level is before the fourth', () => {
    times(FIRST_FIREBALL_LEVEL - 1, (index) => {
      const cleared = clearFireballs(forge(), index + 1);

      expect(
        includes(flatten(cleared), TILE_FIREBALL),
        `level ${index + 1} still burns`,
      ).toBe(false);
    });
  });

  it('should leave the fireballs burning when the level is the fourth through the eighth', () => {
    range(FIRST_FIREBALL_LEVEL, LAST_FIREBALL_LEVEL + 1).forEach((level) => {
      expect(clearFireballs(forge(), level), `level ${level}`).toEqual(forge());
    });
  });

  it('should put every fireball out when the level is past the eighth', () => {
    expect(
      includes(
        flatten(clearFireballs(forge(), LAST_FIREBALL_LEVEL + 1)),
        TILE_FIREBALL,
      ),
    ).toBe(false);
  });

  it('should hand the fireball spot over to a block when one stands beside it', () => {
    expect(clearFireballs(forge(), 1)).toEqual([
      [TILE_AIR, TILE_STONE, TILE_AIR, TILE_SPIKE],
      [TILE_DIRT, TILE_STONE, TILE_WOOD, TILE_DIRT],
    ]);
  });

  it('should look sideways when no block sits above or below', () => {
    expect(
      clearFireballs(
        [
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_WOOD, TILE_FIREBALL, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
        ],
        1,
      )[1][1],
    ).toBe(TILE_WOOD);
  });

  it('should never borrow from a fireball when one stands next door', () => {
    expect(
      clearFireballs(
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
      clearFireballs(
        [
          [TILE_AIR, TILE_AIR, TILE_AIR],
          [TILE_AIR, TILE_FIREBALL, TILE_AIR],
          [TILE_AIR, TILE_AIR, TILE_AIR],
        ],
        1,
      )[1][1],
    ).toBe(TILE_BRICK);
  });

  it('should hand back a grid of its own when it is given one to clear', () => {
    const tiles = forge();

    clearFireballs(tiles, 1);
    clearFireballs(tiles, FIRST_FIREBALL_LEVEL);

    expect(tiles).toEqual(forge());
  });
});
