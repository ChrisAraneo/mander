import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size, sortBy, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFireballs } from './create-fireballs';

const createLevel = (tiles: Tile[][]): Level => ({
  seed: 'SEED',
  width: size(head(tiles)),
  height: size(tiles),
  tiles,
  chestItems: [],
});

const ROW_OF_BLOCKS = createLevel([
  times(12, () => TILE_FIREBALL),
  times(12, () => TILE_DIRT),
]);

describe('createFireballs', () => {
  it('should hang one fireball on the block when the block is a fireball one', () => {
    expect(
      createFireballs(
        createLevel([
          [TILE_FIREBALL, TILE_AIR, TILE_FIREBALL],
          [TILE_DIRT, TILE_DIRT, TILE_DIRT],
        ]),
      ),
    ).toHaveLength(2);
  });

  it('should hang the fireball off the middle of its block when it creates one', () => {
    expect(
      createFireballs(
        createLevel([
          [TILE_AIR, TILE_FIREBALL],
          [TILE_DIRT, TILE_DIRT],
        ]),
      )[0].origin,
    ).toEqual({ x: TILE_SIZE * 1.5, y: TILE_SIZE / 2 });
  });

  it('should stagger the neighbours when fireball blocks stand side by side', () => {
    const fireballs = createFireballs(
      createLevel([
        [TILE_FIREBALL, TILE_FIREBALL],
        [TILE_DIRT, TILE_DIRT],
      ]),
    );

    expect(fireballs[0].angle).not.toBe(fireballs[1].angle);
  });

  it('should send some fireballs round one way and some the other when it creates many', () => {
    expect(
      sortBy(
        uniq(map(createFireballs(ROW_OF_BLOCKS), (fireball) => fireball.spin)),
      ),
    ).toEqual(['ANTICLOCKWISE', 'CLOCKWISE']);
  });

  it('should roll the same spins again when the seed is the same', () => {
    expect(
      map(createFireballs(ROW_OF_BLOCKS), (fireball) => fireball.spin),
    ).toEqual(map(createFireballs(ROW_OF_BLOCKS), (fireball) => fireball.spin));
  });

  it('should roll different spins when the seed differs', () => {
    expect(
      map(
        createFireballs({ ...ROW_OF_BLOCKS, seed: 'OTHER' }),
        (fireball) => fireball.spin,
      ),
    ).not.toEqual(
      map(createFireballs(ROW_OF_BLOCKS), (fireball) => fireball.spin),
    );
  });
});
