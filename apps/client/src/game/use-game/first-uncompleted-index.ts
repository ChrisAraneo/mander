import { levelSeed } from '@mander/generator';

export const firstUncompletedIndex = (
  baseSeed: string,
  completedLevels: string[],
): number => {
  const completedSet = new Set(completedLevels);
  let index = 0;
  while (completedSet.has(levelSeed(baseSeed, index))) index++;
  return index;
};
