import { includes } from 'lodash-es';
import type { Tile } from '../types/tile';
import { ENEMY_TILES } from './consts';

export const isEnemyTile = (tile: Tile): boolean => includes(ENEMY_TILES, tile);
