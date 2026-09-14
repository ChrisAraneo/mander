import { isBeartrap, type Level } from '@mander/model';
import { some } from 'lodash-es';

import { probeColumn } from './probe-column';
import { probeRows } from './probe-rows';

export const isBeartrapAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean =>
  some(probeRows(originY), (row) =>
    isBeartrap(level, probeColumn(originX, facing), row),
  );
