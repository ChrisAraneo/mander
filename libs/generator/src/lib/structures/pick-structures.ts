import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Structure,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { sortBy, take } from 'lodash-es';
import { match } from 'ts-pattern';

type Difficulty = 'normal' | 'hard';

const poolFor = (difficulty: Difficulty): readonly Structure[] =>
  match(difficulty)
    .with('hard', () => HARD_STRUCTURES)
    .otherwise(() => NORMAL_STRUCTURES);

const seedFor = (seed: string, difficulty: Difficulty): string =>
  `${seed}#${difficulty}`;

export const pickStructures = (
  seed: string,
  count: number,
  difficulty: Difficulty,
): Structure[] => {
  const random = createRandom(seedFor(seed, difficulty));
  const pool = poolFor(difficulty);

  return take(
    sortBy(pool, () => random.next()),
    count,
  );
};
