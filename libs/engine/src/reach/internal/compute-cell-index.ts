import type { Level } from '@mander/model';

export const computeCellIndex = (
  level: Level,
  row: number,
  column: number,
): number => row * level.width + column;
