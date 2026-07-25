import { TILE_SIZE } from '@mander/generator';
import { floor, range } from 'lodash-es';

import { ENEMY_HEIGHT } from '../state';

export const probeRows = (originY: number): number[] =>
  range(
    floor((originY + 2) / TILE_SIZE),
    floor((originY + ENEMY_HEIGHT - 2) / TILE_SIZE) + 1,
  );
