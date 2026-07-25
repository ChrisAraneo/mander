import { isSolid, type Level } from '@mander/generator';
import { some } from 'lodash-es';

import { probeColumn } from './probe-column';
import { probeRows } from './probe-rows';

export const wallAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean =>
  some(probeRows(originY), (row) =>
    isSolid(level, probeColumn(originX, facing), row),
  );
