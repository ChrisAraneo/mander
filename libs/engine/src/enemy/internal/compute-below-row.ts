import { TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { ENEMY_HEIGHT } from '../consts';
import { PROBE_INSET } from './consts';

export const computeBelowRow = (originY: number): number =>
  floor((originY + ENEMY_HEIGHT + PROBE_INSET) / TILE_SIZE);
