import type { Sector } from '@mander/structures';
import { createRandom } from '@mander/utils';
import { ceil, flatMap, range, size, sortBy, take } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';
import { formatLevelCategorySeed } from './format-level-category-seed';
import { getStructures } from './get-structures';

export const pickStructures = (
  seed: string,
  count: number,
  levelCategory: LevelCategory,
): Sector[] => {
  const random = createRandom(formatLevelCategorySeed(seed, levelCategory));
  const structures = getStructures(levelCategory);

  return take(
    flatMap(range(ceil(count / size(structures))), () =>
      sortBy(structures, () => random.rollFloat()),
    ),
    count,
  );
};
