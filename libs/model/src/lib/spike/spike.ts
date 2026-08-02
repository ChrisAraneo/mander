import { TILE_SIZE } from '../tile/consts';
import type { Tile } from '../tile/tile';

export const TILE_SPIKE: Tile = 2;
export const TILE_SPIKE_CEILING: Tile = 3;

export const SPIKE_TILES: Tile[] = [TILE_SPIKE, TILE_SPIKE_CEILING];

export const SPIKE_PRONGS = 3;
export const SPIKE_HEIGHT_FRACTION = 0.72;

/**
 * Each prong owns an even slice of the tile and stands in the middle of it.
 * Stepping by the slice rather than by the prong is what puts air between the
 * teeth: it is the same distance whether the neighbour is in this tile or the
 * next one, so a run of spikes combs evenly across the join.
 */
export const PRONG_PITCH = TILE_SIZE / SPIKE_PRONGS;

/**
 * The air between two prongs. The renderer lays a black outline around every
 * prong on its own and leaves 2px of it showing outside the shape, so anything
 * at or under 4px fuses neighbouring teeth into one sawtooth band — the gap has
 * to clear both outlines and still leave daylight.
 */
export const PRONG_GAP = 5;

export const PRONG_HEIGHT = TILE_SIZE * SPIKE_HEIGHT_FRACTION;
export const PRONG_WIDTH = PRONG_PITCH - PRONG_GAP;
