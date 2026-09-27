import { isSolid, type Level } from '@mander/model';

import { getBelowRow } from './get-below-row';
import { getProbeColumn } from './get-probe-column';

export const isLedgeAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean =>
  !isSolid(level, getProbeColumn(originX, facing), getBelowRow(originY));
