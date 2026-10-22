import { createRandom } from '@mander/engine';
import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY } from '../consts';
import { createPalette } from '../palette/create-palette';
import { createLevelCategories } from '../world/create-level-categories';
import { createLevelVariants } from '../world/create-level-variants';
import { takeRandomCategoryStructures } from '../world/take-random-category-structures';
import { createWorldLevels } from './create-world-levels';

const PALETTE = createPalette(createRandom('DAY-1'));

const LEVEL_VARIANTS = createLevelVariants(createRandom('DAY-1'));

const LEVEL_CATEGORIES = createLevelCategories(LEVEL_VARIANTS);

const WORLD_STRUCTURES = takeRandomCategoryStructures(
  LEVEL_CATEGORIES,
  createRandom('DAY-1'),
);

const createWith = (seed: string) =>
  createWorldLevels({
    name: 'WORLD',
    palette: PALETTE,
    levelVariants: LEVEL_VARIANTS,
    levelCategories: LEVEL_CATEGORIES,
    worldStructures: WORLD_STRUCTURES,
    random: createRandom(seed),
  });

const WORLD = createWith('DAY-1');

describe('createWorldLevels', () => {
  it('should build every level of the day when it finishes a world', () => {
    expect(size(WORLD.levels)).toBe(LEVELS_PER_DAY);
  });

  it('should stand a level up where the variants call for a vertical one', () => {
    expect(map(WORLD.levels, (level) => level.isOpenSided === true)).toEqual(
      map(LEVEL_VARIANTS, (levelVariant) => levelVariant === 'VERTICAL'),
    );
  });

  it('should build the levels the same way when the generator starts from the same seed', () => {
    expect(map(WORLD.levels, (level) => level.seed)).toEqual(
      map(createWith('DAY-1').levels, (level) => level.seed),
    );
  }, 120000);

  it('should build the levels another way when the generator starts from another seed', () => {
    expect(map(WORLD.levels, (level) => level.seed)).not.toEqual(
      map(createWith('DAY-2').levels, (level) => level.seed),
    );
  }, 120000);

  it('should keep the name when it finishes a world', () => {
    expect(WORLD.name).toBe('WORLD');
  });

  it('should keep the palette when it finishes a world', () => {
    expect(WORLD.palette).toBe(PALETTE);
  });

  it('should start the score at nothing when it finishes a world', () => {
    expect(WORLD.score).toBe(0);
  });
});
