import type { Level } from '@mander/model';

import { isBackAt } from './is-back-at';
import { isSolidAt } from './is-solid-at';

// a background block is capped where nothing stands over it, in either layer
export const isCoveredAt = (
  level: Level,
  tileX: number,
  tileY: number,
): boolean => isSolidAt(level, tileX, tileY) || isBackAt(level, tileX, tileY);
