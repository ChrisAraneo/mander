import { STRUCTURE_HEIGHT, VERTICAL_HEIGHT } from '@mander/structures';
import { match } from 'ts-pattern';
import type { Pool } from './types/pool';

export const getHeight = (pool: Pool): number =>
  match(pool)
    .with('vertical', () => VERTICAL_HEIGHT)
    .otherwise(() => STRUCTURE_HEIGHT);
