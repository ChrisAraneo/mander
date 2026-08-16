import { find, startsWith } from 'lodash-es';

export type Difficulty = 'normal' | 'hard';

export const DIFFICULTIES: readonly Difficulty[] = Object.freeze([
  'normal',
  'hard',
]);

const PREFIXES: Record<Difficulty, string> = {
  normal: 'NORMAL',
  hard: 'HARD',
};

export const prefixOf = (difficulty: Difficulty): string =>
  PREFIXES[difficulty];

export const difficultyOf = (name: string): Difficulty | null =>
  find(DIFFICULTIES, (difficulty) =>
    startsWith(name, `${prefixOf(difficulty)}_`),
  ) ?? null;

export const isStructureName = (name: string): boolean =>
  /^(NORMAL|HARD)_\d{3,}$/.test(name);
