import { levelSeed } from '@mander/generator';
import { match } from 'ts-pattern';

const nextUncompleted = (
  baseSeed: string,
  completedSet: ReadonlySet<string>,
  index: number,
): number =>
  match(completedSet.has(levelSeed(baseSeed, index)))
    .with(true, () => nextUncompleted(baseSeed, completedSet, index + 1))
    .otherwise(() => index);

export const firstUncompletedIndex = (
  baseSeed: string,
  completedLevels: string[],
): number => nextUncompleted(baseSeed, new Set(completedLevels), 0);
