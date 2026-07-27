import { isReachableCell, type ReachMap } from '@mander/engine';

import type { Surface } from './surface';

export const isReachableSurface = (
  reach: ReachMap,
  surface: Surface,
): boolean =>
  isReachableCell(reach, reach.length - 1 - surface.height, surface.col);
