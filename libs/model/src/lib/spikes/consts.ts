import type { Tile } from '../tiles/tile';
import { TILE_SPIKE } from '../tiles/spike';
import { TILE_SPIKE_CEILING } from '../tiles/spike-ceiling';

export const SPIKE_PRONGS = 3;
export const SPIKE_HEIGHT_FRACTION = 0.72;
export const SPIKE_TILES: Tile[] = [TILE_SPIKE, TILE_SPIKE_CEILING];
