import { isBeartrap, type Level } from '@mander/model';
import { some } from 'lodash-es';
import type { Facing } from '../../types/facing';
import { computeProbeColumn } from './compute-probe-column';
import { computeProbeRows } from './compute-probe-rows';

export const isBeartrapAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: Facing,
): boolean =>
  some(computeProbeRows(originY), (row) =>
    isBeartrap(level, computeProbeColumn(originX, facing), row),
  );
