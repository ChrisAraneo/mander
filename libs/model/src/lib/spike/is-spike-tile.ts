import { includes } from 'lodash-es';

import type { Tile } from '../tile/tile';
import { SPIKE_TILES } from './spike';

export const isSpikeTile = (tile: Tile): boolean => includes(SPIKE_TILES, tile);
