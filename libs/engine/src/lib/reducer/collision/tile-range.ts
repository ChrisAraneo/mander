import { TILE_SIZE } from '@mander/model';
import { floor, range } from 'lodash-es';

import { EPSILON } from './consts';

export const tileRange = (start: number, size: number): number[] =>
  range(
    floor(start / TILE_SIZE),
    floor((start + size - EPSILON) / TILE_SIZE) + 1,
  );
