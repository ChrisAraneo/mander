import type { Level } from '@mander/engine';
import { match } from 'ts-pattern';

const nextUncompleted = (
  levels: Level[],
  completed: ReadonlySet<string>,
  index: number,
): number =>
  match(index < levels.length && completed.has(levels[index].seed))
    .with(true, () => nextUncompleted(levels, completed, index + 1))
    .otherwise(() => index);

/**
 * Where to drop the player back into today's run: the first level they have
 * not finished. Each level carries its own seed and that seed is what the save
 * records, so the run is picked up wherever it was left.
 */
export const firstUncompletedIndex = (
  levels: Level[],
  completedLevels: string[],
): number => nextUncompleted(levels, new Set(completedLevels), 0);
