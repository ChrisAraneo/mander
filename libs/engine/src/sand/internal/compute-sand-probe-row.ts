import { TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { SAND_PROBE_DEPTH } from '../consts';

export const computeSandProbeRow = (
  positionY: number,
  height: number,
): number => floor((positionY + height + SAND_PROBE_DEPTH) / TILE_SIZE);
