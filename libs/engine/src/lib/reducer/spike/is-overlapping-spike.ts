import { type Level } from '@mander/model';
import { SPIKE_ORIENTATIONS } from './consts';
import { isOverlappingSpikeFacing } from './is-overlapping-spike-facing';

export const isOverlappingSpike = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  isOverlappingSpikeFacing(
    level,
    boxLeft,
    boxTop,
    boxWidth,
    boxHeight,
    SPIKE_ORIENTATIONS,
  );
