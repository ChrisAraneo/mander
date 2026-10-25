import type { Random } from '@mander/engine';
import type { Sector } from '@mander/structures';
import { ceil, flatMap, range, size, sortBy, take } from 'lodash-es';
import { pipe } from 'remeda';
import type { LevelCategory } from '../types/level-category';
import { getStructures } from './get-structures';

export const takeRandomStructures = (
  count: number,
  levelCategory: LevelCategory,
  random: Random,
): Sector[] =>
  pipe(levelCategory, getStructures, (structures) =>
    take(
      flatMap(range(ceil(count / size(structures))), () =>
        sortBy(structures, () => random()),
      ),
      count,
    ),
  );
