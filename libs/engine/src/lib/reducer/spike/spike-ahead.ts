import { isSpike, type Level } from '@mander/model';
import { some } from 'lodash-es';

import { probeColumn } from '../enemy/probe-column';
import { probeRows } from '../enemy/probe-rows';

export const spikeAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: 1 | -1,
): boolean =>
  some(probeRows(originY), (row) =>
    isSpike(level, probeColumn(originX, facing), row),
  );
