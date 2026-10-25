import type { Pool } from './types/pool';

export const EMPTY = 'Empty';

export const BLOCKS = 'Blocks';

export const HAZARDS = 'Hazards';

export const BACKGROUND = 'Background';

export const MARKERS = 'Markers';

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

export const STRUCTURE_ENDPOINT = '/api/structures';
