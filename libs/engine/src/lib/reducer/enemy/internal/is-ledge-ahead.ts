import { isSolid, type Level } from '@mander/model';
import type { Facing } from '../../types/facing';
import { computeBelowRow } from './compute-below-row';
import { computeProbeColumn } from './compute-probe-column';

export const isLedgeAhead = (
  level: Level,
  originX: number,
  originY: number,
  facing: Facing,
): boolean =>
  !isSolid(
    level,
    computeProbeColumn(originX, facing),
    computeBelowRow(originY),
  );
