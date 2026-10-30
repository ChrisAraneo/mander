import { createRandom } from '@mander/engine';
import type { Season } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPalette } from '../palette/create-palette';
import { createLevelCategories } from '../world/create-level-categories';
import { createLevelVariants } from '../world/create-level-variants';
import { takeRandomCategoryStructures } from '../world/take-random-category-structures';
import { takeRandomWorldStructures } from './take-random-world-structures';

const SPRING: Season = 'SPRING';

const PALETTE = createPalette(SPRING, createRandom('DAY-1'));

const LEVEL_VARIANTS = createLevelVariants(createRandom('DAY-1'));

const LEVEL_CATEGORIES = createLevelCategories(LEVEL_VARIANTS);

const takeRandomWith = (seed: string) =>
  takeRandomWorldStructures({
    name: 'WORLD',
    season: SPRING,
    palette: PALETTE,
    levelVariants: LEVEL_VARIANTS,
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

  it('should pick no structures when the world has no levels', () => {
    expect(
      takeRandomWorldStructures({
        name: 'WORLD',
        season: SPRING,
        palette: PALETTE,
        levelVariants: [],
        random: createRandom('DAY-1'),
      }).worldStructures,
    ).toEqual({ NORMAL: [], HARD: [], VERTICAL: [] });
  });

  it('should pass the name on when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').name).toBe('WORLD');
  });

  it('should pass the season on when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').season).toBe(SPRING);
  });

  it('should pass the palette on when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').palette).toBe(PALETTE);
  });

  it('should pass the level variants on when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').levelVariants).toBe(LEVEL_VARIANTS);
  });

  it('should read the category of every level off its variant when it picks the structures', () => {
    expect(takeRandomWith('DAY-1').levelCategories).toEqual(LEVEL_CATEGORIES);
  });

  it('should pass the generator on when it picks the structures', () => {
    const random = createRandom('DAY-1');

    expect(
      takeRandomWorldStructures({
        name: 'WORLD',
        season: SPRING,
        palette: PALETTE,
        levelVariants: LEVEL_VARIANTS,
        random,
      }).random,
    ).toBe(random);
  });
});
