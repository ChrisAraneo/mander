import { isSpike, type Level } from '@mander/model';
import { some } from 'lodash-es';

import { getProbeColumn } from '../enemy/get-probe-column';
import { getProbeRows } from '../enemy/get-probe-rows';

export const isSpikeAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean =>
  some(getProbeRows(originY), (row) =>
    isSpike(level, getProbeColumn(originX, facing), row),
  );
