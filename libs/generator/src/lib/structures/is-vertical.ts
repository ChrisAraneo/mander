import type { LevelVariant } from '../types/level-variant';

export const isVertical = (levelVariant: LevelVariant): boolean =>
  levelVariant === 'VERTICAL';
