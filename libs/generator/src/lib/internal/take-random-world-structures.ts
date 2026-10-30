import { pipe } from 'remeda';
import { createLevelCategories } from '../world/create-level-categories';
import { takeRandomCategoryStructures } from '../world/take-random-category-structures';
import type { WorldDrawnStructures } from './types/world-drawn-structures';
import type { WorldLevelVariants } from './types/world-level-variants';

export const takeRandomWorldStructures = ({
  name,
  season,
  palette,
  levelVariants,
  random,
}: WorldLevelVariants): WorldDrawnStructures =>
  pipe(levelVariants, createLevelCategories, (levelCategories) => ({
    name,
    season,
    palette,
    levelVariants,
    levelCategories,
    worldStructures: takeRandomCategoryStructures(levelCategories, random),
    random,
  }));
