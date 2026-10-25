import { STRUCTURE_TYPES } from './consts.ts';
import type { Pool } from './types/pool.ts';

export const getType = (pool: Pool): string => STRUCTURE_TYPES[pool];
