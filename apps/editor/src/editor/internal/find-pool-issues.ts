import type { Layers } from '@mander/model';
import { findVerticalIssues } from '@mander/structures';
import { match } from 'ts-pattern';
import type { Pool } from '../types/pool';

export const findPoolIssues = (sketch: Layers, pool: Pool): string[] =>
  match(pool)
    .with('vertical', () => findVerticalIssues(sketch.tiles))
    .otherwise((): string[] => []);
