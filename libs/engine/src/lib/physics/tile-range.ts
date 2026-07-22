import { TILE_SIZE } from '@mander/generator';
import { floor, range } from 'lodash-es';

import { EPSILON } from './internal-constants';

export const tileRange = (start: number, size: number): number[] =>
  range(
    floor(start / TILE_SIZE),
    floor((start + size - EPSILON) / TILE_SIZE) + 1,
  );
