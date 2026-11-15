import { TILE_SIZE } from '@mander/model';
import { floor, range } from 'lodash-es';
import { ENEMY_HEIGHT } from '../consts';
import { PROBE_INSET } from './consts';

export const computeProbeRows = (originY: number): number[] =>
  range(
    floor((originY + PROBE_INSET) / TILE_SIZE),
    floor((originY + ENEMY_HEIGHT - PROBE_INSET) / TILE_SIZE) + 1,
  );
