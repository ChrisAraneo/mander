import { createRandom } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../consts';
import { createPalette } from '../palette/create-palette';
import { createLevelCategories } from '../world/create-level-categories';
import { takeRandomCategoryStructures } from '../world/take-random-category-structures';
import { takeRandomWorldStructures } from './take-random-world-structures';

const PALETTE = createPalette(createRandom('DAY-1'));

const LEVEL_CATEGORIES = createLevelCategories(LEVELS_PER_DAY);

const takeRandomWith = (seed: string) =>
  takeRandomWorldStructures({
    name: 'WORLD',
    palette: PALETTE,
    levelCategories: LEVEL_CATEGORIES,
    random: createRandom(seed),
  });

describe('takeRandomWorldStructures', () => {
  it('should pick the structures of every category from the generator when it starts a world', () => {
    expect(takeRandomWith('DAY-1').worldStructures).toEqual(
      takeRandomCategoryStructures(LEVEL_CATEGORIES, createRandom('DAY-1')),
    );
  });

  it('should pick the same structures when the generator starts from the same seed', () => {
    expect(takeRandomWith('DAY-1').worldStructures).toEqual(
      takeRandomWith('DAY-1').worldStructures,
    );
  });

  it('should pick other structures when the generator starts from another seed', () => {
    expect(takeRandomWith('DAY-1').worldStructures).not.toEqual(
      takeRandomWith('DAY-2').worldStructures,
    );
  });

  it('should pass the name on when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').name).toBe('WORLD');
  });

  it('should pass the palette on when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').palette).toBe(PALETTE);
  });

  it('should pass the level categories on when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').levelCategories).toBe(LEVEL_CATEGORIES);
  });

  it('should pass the generator on when it picks the structures', () => {
    const random = createRandom('DAY-1');

    expect(
      takeRandomWorldStructures({
        name: 'WORLD',
        palette: PALETTE,
        levelCategories: LEVEL_CATEGORIES,
        random,
      }).random,
    ).toBe(random);
  });
});
