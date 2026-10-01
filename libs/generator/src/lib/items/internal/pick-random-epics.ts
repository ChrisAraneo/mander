import type { Item } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { concat, includes, reduce, reject, size, times } from 'lodash-es';
import { EPIC_POOL } from '../../consts';

export const pickRandomEpics = (
  rolled: number,
  random: ReturnType<typeof createRandom>,
): Item[] =>
  reduce(
    times(Math.min(rolled, size(EPIC_POOL))),
    (picked: Item[]): Item[] =>
      concat(
        picked,
        random.pick(reject(EPIC_POOL, (item) => includes(picked, item))),
      ),
    [],
  );
