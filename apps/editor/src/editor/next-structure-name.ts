import { filter, map, max, padStart, startsWith } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Difficulty, StructureEntry } from './structure-entry';

const PREFIXES: Record<Difficulty, string> = {
  normal: 'NORMAL',
  hard: 'HARD',
};

const numberIn = (name: string): number => Number(name.split('_')[1] ?? 0);

const highest = (entries: StructureEntry[], difficulty: Difficulty): number =>
  max(
    map(
      filter(entries, (entry) => entry.difficulty === difficulty),
      (entry) => numberIn(entry.name),
    ),
  ) ?? 0;

const NAME_DIGITS = 3;

export const nextStructureName = (
  entries: StructureEntry[],
  difficulty: Difficulty,
): string =>
  `${PREFIXES[difficulty]}_${padStart(String(highest(entries, difficulty) + 1), NAME_DIGITS, '0')}`;

export const difficultyOf = (name: string): Difficulty =>
  match(startsWith(name, PREFIXES.hard))
    .with(true, (): Difficulty => 'hard')
    .otherwise((): Difficulty => 'normal');
