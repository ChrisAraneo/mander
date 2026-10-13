import { takeRandomCategoryStructures } from '../world/take-random-category-structures';
import type { createWorldLevelCategories } from './create-world-level-categories';

export const takeRandomWorldStructures = ({
  name,
  palette,
  levelCategories,
  random,
}: ReturnType<typeof createWorldLevelCategories>) => ({
  name,
  palette,
  levelCategories,
  worldStructures: takeRandomCategoryStructures(levelCategories, random),
  random,
});
