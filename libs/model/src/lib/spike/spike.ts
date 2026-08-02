import { TILE_SIZE } from '../blocks/consts';
import type { Tile } from '../tile/tile';

export const TILE_SPIKE: Tile = 2;
export const TILE_SPIKE_CEILING: Tile = 3;

export const SPIKE_TILES: Tile[] = [TILE_SPIKE, TILE_SPIKE_CEILING];

export const SPIKE_PRONGS = 3;
export const SPIKE_HEIGHT_FRACTION = 0.72;

export const PRONG_HEIGHT = TILE_SIZE * SPIKE_HEIGHT_FRACTION;
export const PRONG_WIDTH = TILE_SIZE / SPIKE_PRONGS;

/**
 * Floor prongs are cut back from the ceiling's. They are the ones the player
 * runs past at ankle height all level long, so they read better as teeth in
 * the ground than as a hedge of full-height blades.
 */
export const FLOOR_PRONG_TRIM = 4;
export const FLOOR_PRONG_HEIGHT = PRONG_HEIGHT - FLOOR_PRONG_TRIM;
