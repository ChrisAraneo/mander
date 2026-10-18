import { isSpikeTile, type Tile, TILE_SPIKE_FALLING } from '@mander/model';

export const isClearableSpikeTile = (tile: Tile): boolean =>
  isSpikeTile(tile) || tile === TILE_SPIKE_FALLING;
