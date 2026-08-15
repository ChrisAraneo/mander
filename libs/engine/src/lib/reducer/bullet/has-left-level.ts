import { type Bullet, type Level, TILE_SIZE } from '@mander/model';

import { BULLET_SIZE } from './consts';

export const hasLeftLevel = (level: Level, bullet: Bullet): boolean =>
  bullet.position.x + BULLET_SIZE < 0 ||
  bullet.position.x > level.width * TILE_SIZE;
