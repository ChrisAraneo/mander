import { SECTOR_WIDTH } from '../../consts';
import type { Structure } from '../types';
import { groundHeight } from './ground-height';

export function structureExitLift(grid: Structure): number {
  return Math.max(0, groundHeight(grid, SECTOR_WIDTH - 1) - 1);
}
