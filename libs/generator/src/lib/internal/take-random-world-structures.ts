import { takeRandomCategoryStructures } from '../world/take-random-category-structures';
import type { WorldDrawnStructures } from './types/world-drawn-structures';
import type { WorldLevelCategories } from './types/world-level-categories';

export const takeRandomWorldStructures = ({
  name,
  palette,
  levelCategories,
  random,
}: WorldLevelCategories): WorldDrawnStructures => ({
  name,
  palette,
  levelCategories,
  worldStructures: takeRandomCategoryStructures(levelCategories, random),
  random,
});
