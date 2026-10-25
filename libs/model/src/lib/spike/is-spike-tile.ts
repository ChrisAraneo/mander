import { includes } from 'lodash-es';
import type { Tile } from '../types/tile';
import { SPIKE_TILES } from './consts';

export const isSpikeTile = (tile: Tile): boolean => includes(SPIKE_TILES, tile);
