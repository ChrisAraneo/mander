import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Sector,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { ceil, flatMap, range, size, sortBy, take } from 'lodash-es';
import { match } from 'ts-pattern';

export type Pool = 'normal' | 'hard' | 'vertical';

const getStructures = (pool: Pool): readonly Sector[] =>
  match(pool)
    .with('hard', () => HARD_STRUCTURES)
    .with('vertical', () => VERTICAL_STRUCTURES)
    .otherwise(() => NORMAL_STRUCTURES);

const formatPoolSeed = (seed: string, pool: Pool): string => `${seed}#${pool}`;

export const pickStructures = (
  seed: string,
  count: number,
  pool: Pool,
): Sector[] => {
  const random = createRandom(formatPoolSeed(seed, pool));
  const structures = getStructures(pool);

  return take(
    flatMap(range(ceil(count / size(structures))), () =>
      sortBy(structures, () => random.rollFloat()),
    ),
    count,
  );
};
