import type { LevelVariant } from '../types/level-variant';

export const isMirrored = (levelVariant: LevelVariant): boolean =>
  levelVariant === 'MIRRORED';
