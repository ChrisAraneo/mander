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

/**
 * The two pools share most of their structures, so drawing both from the bare
 * seed would deal the hard level the front of the normal one. Naming the
 * difficulty in the seed gives each its own stream while keeping the day it
 * was dealt from.
 */
const seedFor = (seed: string, difficulty: Difficulty): string =>
  `${seed}#${difficulty}`;

/**
 * Deals the structures a level is built from, no structure twice: the pool is
 * shuffled and the front of it taken.
 *
 * A level is only as long as the library can fill without repeating itself, so
 * asking for more than the pool holds gets the whole pool rather than a shorter
 * level padded out with second helpings. Drawing a structure again is the one
 * thing the player is guaranteed to notice — the same twenty columns twice in a
 * run reads as a mistake in a way that a shorter level never does.
 */
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
