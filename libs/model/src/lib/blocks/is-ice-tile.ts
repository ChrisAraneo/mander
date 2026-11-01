import type { Tile } from '../types/tile';
import { TILE_ICE } from './tile-ice';

export const isIceTile = (tile: Tile): boolean => tile === TILE_ICE;
