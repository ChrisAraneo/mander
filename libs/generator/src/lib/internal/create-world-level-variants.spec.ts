import { createRandom, type Random } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPalette } from '../palette/create-palette';
import { createLevelVariants } from '../world/create-level-variants';
import { createWorldLevelVariants } from './create-world-level-variants';

const SPRING: Season = 'SPRING';

const PALETTE = createPalette(SPRING, createRandom('DAY-1'));

const createWith = (random: Random) =>
  createWorldLevelVariants({
    name: 'WORLD',
    season: SPRING,
    palette: PALETTE,
    random,
  });

describe('createWorldLevelVariants', () => {
  it('should deal the variants from the generator when it starts a world', () => {
    expect(createWith(createRandom('DAY-1')).levelVariants).toEqual(
      createLevelVariants(createRandom('DAY-1')),
    );
  });

  it('should keep the name when it deals the variants', () => {
    expect(createWith(createRandom('DAY-1')).name).toBe('WORLD');
  });

  it('should keep the season when it deals the variants', () => {
    expect(createWith(createRandom('DAY-1')).season).toBe(SPRING);
  });

  it('should keep the palette when it deals the variants', () => {
    expect(createWith(createRandom('DAY-1')).palette).toBe(PALETTE);
  });

  it('should pass the generator on when it deals the variants', () => {
    const random = createRandom('DAY-1');

    expect(createWith(random).random).toBe(random);
  });
});
