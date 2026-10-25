import { type Level, TILE_SIZE } from '@mander/model';
import type { Focus } from '../types/focus';
import { findFloorRow } from './internal/find-floor-row';

export const computeMidLevelFocus = (level: Level): Focus => ({
  x: (level.width * TILE_SIZE) / 2,
  y: findFloorRow(level) * TILE_SIZE,
});
