import type { Sector } from '@mander/structures';
import { chain, type createRandom } from '@mander/utils';
import { ceil, flatMap, range, size, sortBy, take } from 'lodash-es';
import type { LevelCategory } from '../types/level-category';
import { getStructures } from './get-structures';

export const takeRandomStructures = (
  count: number,
  levelCategory: LevelCategory,
  random: ReturnType<typeof createRandom>,
): Sector[] =>
  chain(getStructures(levelCategory))
    .thru((structures) =>
      take(
        flatMap(range(ceil(count / size(structures))), () =>
          sortBy(structures, () => random.rollFloat()),
        ),
        count,
      ),
    )
    .value();
