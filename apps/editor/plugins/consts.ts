import type { Pool } from './types/pool.ts';

export const POOLS: readonly Pool[] = Object.freeze([
  'normal',
  'hard',
  'vertical',
]);

export const STRUCTURE_PREFIXES: Readonly<Record<Pool, string>> = Object.freeze(
  {
    normal: 'NORMAL',
    hard: 'HARD',
    vertical: 'VERTICAL',
  },
);

export const STRUCTURE_TYPES: Readonly<Record<Pool, string>> = Object.freeze({
  normal: 'Structure',
  hard: 'Structure',
  vertical: 'VerticalStructure',
});
