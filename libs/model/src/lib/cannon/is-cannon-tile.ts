import { includes } from 'lodash-es';
import type { Tile } from '../types/tile';
import { CANNON_TILES } from './consts';

export const isCannonTile = (tile: Tile): boolean =>
  includes(CANNON_TILES, tile);
