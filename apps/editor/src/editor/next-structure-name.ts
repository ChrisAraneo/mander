import { filter, map, max, padStart } from 'lodash-es';

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

export const nextStructureName = (
  entries: StructureEntry[],
  difficulty: Difficulty,
): string =>
  `${PREFIXES[difficulty]}_${padStart(String(highest(entries, difficulty) + 1), 2, '0')}`;

export const difficultyOf = (name: string): Difficulty =>
  name.startsWith(PREFIXES.hard) ? 'hard' : 'normal';
