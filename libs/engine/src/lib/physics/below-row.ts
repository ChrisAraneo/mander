import { TILE_SIZE } from '@mander/generator';
import { floor } from 'lodash-es';

import { ENEMY_HEIGHT } from '../state';

export const belowRow = (originY: number): number =>
  floor((originY + ENEMY_HEIGHT + 2) / TILE_SIZE);
