import type { Level } from '../../types/level';
import type { WorldLevelMeta } from '../types/world-level-meta';

const EMPTY_STRUCTURES: string[] = [];

export const toWorldLevelMeta = (
  level: Level,
  index: number,
): WorldLevelMeta => ({
  level: index + 1,
  structures: level.meta?.structures ?? EMPTY_STRUCTURES,
});
