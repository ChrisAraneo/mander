import { createRandom, type Random } from '@mander/engine';
import { describe, expect, it } from 'vitest';

import { createPalette } from '../palette/create-palette';
import { createLevelVariants } from '../world/create-level-variants';
import { createWorldLevelVariants } from './create-world-level-variants';

const PALETTE = createPalette(createRandom('DAY-1'));

const createWith = (random: Random) =>
  createWorldLevelVariants({ name: 'WORLD', palette: PALETTE, random });

describe('createWorldLevelVariants', () => {
  it('should deal the variants from the generator when it starts a world', () => {
    expect(createWith(createRandom('DAY-1')).levelVariants).toEqual(
      createLevelVariants(createRandom('DAY-1')),
    );
  });

  it('should keep the name when it deals the variants', () => {
    expect(createWith(createRandom('DAY-1')).name).toBe('WORLD');
  });

  it('should keep the palette when it deals the variants', () => {
    expect(createWith(createRandom('DAY-1')).palette).toBe(PALETTE);
  });

  it('should pass the generator on when it deals the variants', () => {
    const random = createRandom('DAY-1');

    expect(createWith(random).random).toBe(random);
  });
});
