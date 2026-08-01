import {
  HARD_STRUCTURES,
  NORMAL_STRUCTURES,
  type Structure,
} from '@mander/structures';
import { createRandom } from '@mander/utils';
import { times } from 'lodash-es';
import { match } from 'ts-pattern';

type Difficulty = 'normal' | 'hard';

const STRUCTURE_COUNT = 7;

const poolFor = (difficulty: Difficulty): readonly Structure[] =>
  match(difficulty)
    .with('hard', () => HARD_STRUCTURES)
    .otherwise(() => NORMAL_STRUCTURES);

export const pickStructures = (
  seed: string,
  difficulty: Difficulty,
): Structure[] => {
  const random = createRandom(seed);
  const pool = poolFor(difficulty);

  return times(STRUCTURE_COUNT, () => pool[random.int(0, pool.length - 1)]);
};
