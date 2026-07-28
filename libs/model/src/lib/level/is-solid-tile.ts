import { includes } from 'lodash-es';

import { SOLID_TILES } from './constants';
import type { Tile } from './tile';

export const isSolidTile = (tile: Tile): boolean => includes(SOLID_TILES, tile);
