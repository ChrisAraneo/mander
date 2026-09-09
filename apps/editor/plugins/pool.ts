import { find, startsWith } from 'lodash-es';

export type Pool = 'normal' | 'hard' | 'vertical';

export const POOLS: readonly Pool[] = Object.freeze([
  'normal',
  'hard',
  'vertical',
]);

const PREFIXES: Record<Pool, string> = {
  normal: 'NORMAL',
  hard: 'HARD',
  vertical: 'VERTICAL',
};

const TYPES: Record<Pool, string> = {
  normal: 'Structure',
  hard: 'Structure',
  vertical: 'VerticalStructure',
};

export const prefixOf = (pool: Pool): string => PREFIXES[pool];

export const typeOf = (pool: Pool): string => TYPES[pool];

export const poolOf = (name: string): Pool | null =>
  find(POOLS, (pool) => startsWith(name, `${prefixOf(pool)}_`)) ?? null;

export const isStructureName = (name: string): boolean =>
  /^(NORMAL|HARD|VERTICAL)_\d{3,}$/.test(name);
