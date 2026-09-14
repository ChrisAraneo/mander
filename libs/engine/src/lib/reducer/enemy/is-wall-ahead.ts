import { isSolid, type Level } from '@mander/model';
import { some } from 'lodash-es';

import { getProbeColumn } from './get-probe-column';
import { getProbeRows } from './get-probe-rows';

export const isWallAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean =>
  some(getProbeRows(originY), (row) =>
    isSolid(level, getProbeColumn(originX, facing), row),
  );
