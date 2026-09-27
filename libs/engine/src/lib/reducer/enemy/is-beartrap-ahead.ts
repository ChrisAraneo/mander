import { isBeartrap, type Level } from '@mander/model';
import { some } from 'lodash-es';

import { getProbeColumn } from './get-probe-column';
import { getProbeRows } from './get-probe-rows';

export const isBeartrapAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean =>
  some(getProbeRows(originY), (row) =>
    isBeartrap(level, getProbeColumn(originX, facing), row),
  );
