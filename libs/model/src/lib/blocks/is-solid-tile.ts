import { includes } from 'lodash-es';
import type { Tile } from '../types/tile';
import { SOLID_TILES } from './consts';

export const isSolidTile = (tile: Tile): boolean => includes(SOLID_TILES, tile);
