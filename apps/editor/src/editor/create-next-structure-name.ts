import {
  filter,
  find,
  map,
  max,
  nth,
  padStart,
  split,
  startsWith,
} from 'lodash-es';

import type { Pool, StructureEntry } from './structure-entry';

const PREFIXES: Record<Pool, string> = {
  normal: 'NORMAL',
  hard: 'HARD',
  vertical: 'VERTICAL',
};

export const POOLS: readonly Pool[] = Object.freeze([
  'normal',
  'hard',
  'vertical',
]);

const parseNumber = (name: string): number =>
  Number(nth(split(name, '_'), 1) ?? 0);

const findHighest = (entries: StructureEntry[], pool: Pool): number =>
  max(
    map(
      filter(entries, (entry) => entry.pool === pool),
      (entry) => parseNumber(entry.name),
    ),
  ) ?? 0;

const NAME_DIGITS = 3;

export const createNextStructureName = (
  entries: StructureEntry[],
  pool: Pool,
): string =>
  `${PREFIXES[pool]}_${padStart(String(findHighest(entries, pool) + 1), NAME_DIGITS, '0')}`;

export const getPool = (name: string): Pool =>
  find(POOLS, (pool) => startsWith(name, PREFIXES[pool])) ?? 'normal';
