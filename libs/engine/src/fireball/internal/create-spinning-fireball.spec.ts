import { createRandom } from '@mander/common';
import { type Point, TILE_SIZE } from '@mander/model';
import { map, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createSpinningFireball } from './create-spinning-fireball';

const SEED = 'SEED';

const OTHER_SEED = 'OTHER';

const DRAW_SAMPLES = 12;

const TILE: Point = { x: 3, y: 2 };

const NEIGHBOUR_TILE: Point = { x: 4, y: 2 };

const BLOCK_CENTRE: Point = { x: TILE_SIZE * 3.5, y: TILE_SIZE * 2.5 };

describe('createSpinningFireball', () => {
  it('should mark the ball as a burning one when it is hung on a fireball block', () => {
    expect(createSpinningFireball('FIRE', TILE, createRandom(SEED)).kind).toBe(
      'FIRE',
    );
  });

  it('should mark the ball as an icy one when it is hung on an ice ball block', () => {
    expect(createSpinningFireball('ICE', TILE, createRandom(SEED)).kind).toBe(
      'ICE',
    );
  });

  it('should mark the ball as a pink one when it is hung on a pink ball block', () => {
    expect(createSpinningFireball('PINK', TILE, createRandom(SEED)).kind).toBe(
      'PINK',
    );
  });

  it('should hang the ball off the middle of its block when it creates one', () => {
    expect(
      createSpinningFireball('FIRE', TILE, createRandom(SEED)).origin,
    ).toEqual(BLOCK_CENTRE);
  });

  it('should draw the spin from the given random when it creates one', () => {
    expect(
      uniq(
        map(
          times(DRAW_SAMPLES),
          () => createSpinningFireball('FIRE', TILE, createRandom(SEED)).spin,
        ),
      ),
    ).toEqual([createSpinningFireball('FIRE', TILE, createRandom(SEED)).spin]);
  });

  it('should send the ball round the other way when it is given another seed', () => {
    expect(
      createSpinningFireball('FIRE', TILE, createRandom(SEED)).spin,
    ).not.toBe(
      createSpinningFireball('FIRE', TILE, createRandom(OTHER_SEED)).spin,
    );
  });

  it('should stagger the ball by its place when the blocks stand side by side', () => {
    expect(
      createSpinningFireball('FIRE', TILE, createRandom(SEED)).angle,
    ).not.toBe(
      createSpinningFireball('FIRE', NEIGHBOUR_TILE, createRandom(SEED)).angle,
    );
  });
});
