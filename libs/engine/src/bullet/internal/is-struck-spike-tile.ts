import { isSpike, type Level, type Point, type Rectangle } from '@mander/model';
import { computeProngBand } from './compute-prong-band';
import { isOverlappingBox } from './is-overlapping-box';

export const isStruckSpikeTile = (
  level: Level,
  box: Rectangle,
  tile: Point,
): boolean =>
  isSpike(level, tile.x, tile.y) &&
  isOverlappingBox(box, computeProngBand(level, tile));
