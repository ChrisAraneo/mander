import type { Level } from '@mander/model';

import { backAt } from './back-at';
import { solidAt } from './solid-at';

// a background block is capped where nothing stands over it, in either layer
export const coveredAt = (
  level: Level,
  tileX: number,
  tileY: number,
): boolean => solidAt(level, tileX, tileY) || backAt(level, tileX, tileY);
