import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Structure,
  VERTICAL_STRUCTURES,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { ceil, flatMap, range, size, sortBy, take } from 'lodash-es';
import { match } from 'ts-pattern';

export type Pool = 'normal' | 'hard' | 'vertical';

const structuresOf = (pool: Pool): readonly Structure[] =>
  match(pool)
    .with('hard', () => HARD_STRUCTURES)
    .with('vertical', () => VERTICAL_STRUCTURES)
    .otherwise(() => NORMAL_STRUCTURES);

const seedFor = (seed: string, pool: Pool): string => `${seed}#${pool}`;

export const pickStructures = (
  seed: string,
  count: number,
  pool: Pool,
): Structure[] => {
  const random = createRandom(seedFor(seed, pool));
  const structures = structuresOf(pool);

  return take(
    flatMap(range(ceil(count / size(structures))), () =>
      sortBy(structures, () => random.next()),
    ),
    count,
  );
};
