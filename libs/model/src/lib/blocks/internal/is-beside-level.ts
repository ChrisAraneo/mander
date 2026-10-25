import type { Level } from '../../types/level';

export const isBesideLevel = (level: Level, tileX: number): boolean =>
  tileX < 0 || tileX >= level.width;
