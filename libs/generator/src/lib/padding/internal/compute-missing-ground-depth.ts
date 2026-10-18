import type { Tile } from '@mander/model';
import { size } from 'lodash-es';

const GROUND_DEPTH = 4;

export const computeMissingGroundDepth = (
  front: Tile[][],
  row: number,
): number => Math.max(0, GROUND_DEPTH - (size(front) - 1 - row));
