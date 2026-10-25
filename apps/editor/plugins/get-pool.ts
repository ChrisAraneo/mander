import { find, startsWith } from 'lodash-es';
import { POOLS } from './consts.ts';
import { getPrefix } from './get-prefix.ts';
import type { Pool } from './types/pool.ts';

export const getPool = (name: string): Pool | undefined =>
  find(POOLS, (pool) => startsWith(name, `${getPrefix(pool)}_`));
