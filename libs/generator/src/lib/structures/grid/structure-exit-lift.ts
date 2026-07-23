import { SECTOR_WIDTH } from '../../consts';
import type { Structure } from '../types';
import { groundHeight } from './ground-height';

export const structureExitLift = (grid: Structure): number =>
  Math.max(0, groundHeight(grid, SECTOR_WIDTH - 1) - 1);
