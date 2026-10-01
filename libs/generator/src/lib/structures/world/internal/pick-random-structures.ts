import type { Sector } from '@mander/structures';
import type { createRandom } from '@mander/utils';
import { ceil, flatMap, range, size, sortBy, take } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';
import { getStructures } from './get-structures';

export const pickRandomStructures = (
  count: number,
  levelCategory: LevelCategory,
  random: ReturnType<typeof createRandom>,
): Sector[] => {
  const structures = getStructures(levelCategory);

  return take(
    flatMap(range(ceil(count / size(structures))), () =>
      sortBy(structures, () => random.rollFloat()),
    ),
    count,
  );
};
