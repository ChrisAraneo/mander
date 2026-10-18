import type { Level } from '@mander/model';
import { isBackAt } from './is-back-at';
import { isSolidAt } from './is-solid-at';

export const isCoveredAt = (
  level: Level,
  column: number,
  row: number,
): boolean => isSolidAt(level, column, row) || isBackAt(level, column, row);
