import { isSolid, type Level } from '@mander/generator';
import { belowRow, probeColumn } from './enemy-probe';

export const ledgeAhead = (level: Level, originX: number, originY: number, facing: 1 | -1): boolean =>
  !isSolid(level, probeColumn(originX, facing), belowRow(originY));
