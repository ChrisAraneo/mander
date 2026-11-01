import { TILE_SIZE } from '@mander/model';
import { map, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createRandom } from '../../../random/create-random';
import { createSpinningFireball } from './create-spinning-fireball';

const TILE = { x: 3, y: 2 };

describe('createSpinningFireball', () => {
  it('should mark the ball as a burning one when it is hung on a fireball block', () => {
    expect(
      createSpinningFireball('FIRE', TILE, createRandom('SEED')).kind,
    ).toBe('FIRE');
  });

  it('should mark the ball as an icy one when it is hung on an ice ball block', () => {
    expect(createSpinningFireball('ICE', TILE, createRandom('SEED')).kind).toBe(
      'ICE',
    );
  });

  it('should hang the ball off the middle of its block when it creates one', () => {
    expect(
      createSpinningFireball('FIRE', TILE, createRandom('SEED')).origin,
    ).toEqual({ x: TILE_SIZE * 3.5, y: TILE_SIZE * 2.5 });
  });

  it('should draw the spin from the given random when it creates one', () => {
    expect(
      uniq(
        map(
          times(12),
          () => createSpinningFireball('FIRE', TILE, createRandom('SEED')).spin,
        ),
      ),
    ).toEqual([
      createSpinningFireball('FIRE', TILE, createRandom('SEED')).spin,
    ]);
  });

  it('should stagger the ball by its place when the blocks stand side by side', () => {
    expect(
      createSpinningFireball('FIRE', TILE, createRandom('SEED')).angle,
    ).not.toBe(
      createSpinningFireball('FIRE', { x: 4, y: 2 }, createRandom('SEED'))
        .angle,
    );
  });
});
