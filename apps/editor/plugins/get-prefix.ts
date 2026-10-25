import { STRUCTURE_PREFIXES } from './consts.ts';
import type { Pool } from './types/pool.ts';

export const getPrefix = (pool: Pool): string => STRUCTURE_PREFIXES[pool];
