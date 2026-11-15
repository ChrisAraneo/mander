import type { Level } from '@mander/model';
import { isHittingSpikeTiles } from './internal/is-hitting-spike-tiles';

export const isOverlappingSpike = (
  level: Level,
  boxLeft: number,
  boxTop: number,
  boxWidth: number,
  boxHeight: number,
): boolean =>
  isHittingSpikeTiles(level, {
    x: boxLeft,
    y: boxTop,
    width: boxWidth,
    height: boxHeight,
  });
