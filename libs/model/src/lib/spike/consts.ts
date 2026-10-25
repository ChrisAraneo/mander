import { TILE_SIZE } from '../tile/consts';
import type { Tile } from '../types/tile';
import { TILE_SPIKE } from './tile-spike';
import { TILE_SPIKE_CEILING } from './tile-spike-ceiling';

export const SPIKE_TILES: readonly Tile[] = Object.freeze([
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
]);

export const SPIKE_PRONGS = 3;

export const SPIKE_HEIGHT_FRACTION = 0.68;

export const PRONG_PITCH = TILE_SIZE / SPIKE_PRONGS;

export const PRONG_GAP = 5;

export const PRONG_HEIGHT = TILE_SIZE * SPIKE_HEIGHT_FRACTION;

export const PRONG_WIDTH = PRONG_PITCH - PRONG_GAP;
