import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../consts';
import { createPalette } from '../palette/create-palette';
import { createLevelCategories } from '../world/create-level-categories';
import { createWorldLevelCategories } from './create-world-level-categories';

const PALETTE = createPalette(createRandom('DAY-1'));

const RANDOM = createRandom('DAY-1');

describe('createWorldLevelCategories', () => {
  it('should give every level of the day its category when it starts a world', () => {
    expect(
      createWorldLevelCategories({
        name: 'WORLD',
        palette: PALETTE,
        random: RANDOM,
      }).levelCategories,
    ).toEqual(createLevelCategories(LEVELS_PER_DAY));
  });

  it('should pass the name on when it gives the levels their categories', () => {
    expect(
      createWorldLevelCategories({
        name: 'WORLD',
        palette: PALETTE,
        random: RANDOM,
      }).name,
    ).toBe('WORLD');
  });

  it('should pass the palette on when it gives the levels their categories', () => {
    expect(
      createWorldLevelCategories({
        name: 'WORLD',
        palette: PALETTE,
        random: RANDOM,
      }).palette,
    ).toBe(PALETTE);
  });

  it('should pass the generator on when it gives the levels their categories', () => {
    expect(
      createWorldLevelCategories({
        name: 'WORLD',
        palette: PALETTE,
        random: RANDOM,
      }).random,
    ).toBe(RANDOM);
  });
});
