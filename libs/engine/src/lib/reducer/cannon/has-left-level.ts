import { type Cannonball, type Level, TILE_SIZE } from '@mander/model';

import { CANNONBALL_SIZE } from './consts';

export const hasLeftLevel = (level: Level, cannonball: Cannonball): boolean =>
  cannonball.position.x + CANNONBALL_SIZE < 0 ||
  cannonball.position.x > level.width * TILE_SIZE;
