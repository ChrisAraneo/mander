import { isSolid, type Level } from '@mander/generator';

import { belowRow } from './below-row';
import { probeColumn } from './probe-column';

export const ledgeAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean => !isSolid(level, probeColumn(originX, facing), belowRow(originY));
