import { TILE_SIZE } from '@mander/model';
import { round } from 'lodash-es';

export const wholeTileScale = (scale: number): number =>
  Math.max(1, round(scale * TILE_SIZE)) / TILE_SIZE;
