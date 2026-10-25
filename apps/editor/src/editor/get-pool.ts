import { find, startsWith } from 'lodash-es';
import { POOLS, STRUCTURE_PREFIXES } from './consts';
import type { Pool } from './types/pool';

export const getPool = (name: string): Pool =>
  find(POOLS, (pool) => startsWith(name, STRUCTURE_PREFIXES[pool])) ?? 'normal';
