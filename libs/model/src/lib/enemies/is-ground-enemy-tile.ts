import { includes } from 'lodash-es';
import type { Tile } from '../types/tile';
import { GROUND_ENEMY_TILES } from './consts';

export const isGroundEnemyTile = (tile: Tile): boolean =>
  includes(GROUND_ENEMY_TILES, tile);
