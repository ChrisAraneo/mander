import type { Bullet } from '@mander/model';
import type { Rectangle } from '@mander/utils';

import { BULLET_HITBOX_INSET, BULLET_SIZE } from './consts';

export const getBulletBox = (bullet: Bullet): Rectangle => ({
  x: bullet.position.x + BULLET_HITBOX_INSET,
  y: bullet.position.y + BULLET_HITBOX_INSET,
  width: BULLET_SIZE - 2 * BULLET_HITBOX_INSET,
  height: BULLET_SIZE - 2 * BULLET_HITBOX_INSET,
});
