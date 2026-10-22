import { chain } from '@mander/model';
import { createLevelCategories } from '../world/create-level-categories';
import { takeRandomCategoryStructures } from '../world/take-random-category-structures';
import type { WorldDrawnStructures } from './types/world-drawn-structures';
import type { WorldLevelVariants } from './types/world-level-variants';

export const takeRandomWorldStructures = ({
  name,
  palette,
  levelVariants,
  random,
}: WorldLevelVariants): WorldDrawnStructures =>
  chain(createLevelCategories(levelVariants))
    .thru((levelCategories) => ({
      name,
      palette,
      levelVariants,
      levelCategories,
      worldStructures: takeRandomCategoryStructures(levelCategories, random),
      random,
    }))
    .value();
