import { isSolid, type Level } from '@mander/model';
import { some } from 'lodash-es';
import type { Facing } from '../../types/facing';
import { computeProbeColumn } from './compute-probe-column';
import { computeProbeRows } from './compute-probe-rows';

export const isWallAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: Facing,
): boolean =>
  some(computeProbeRows(originY), (row) =>
    isSolid(level, computeProbeColumn(originX, facing), row),
  );
