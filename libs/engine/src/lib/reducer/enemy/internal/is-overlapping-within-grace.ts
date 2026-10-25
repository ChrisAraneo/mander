import type { Hitbox } from '../../types/hitbox';
import { STOMP_GRACE_X } from '../consts';

export const isOverlappingWithinGrace = (
  playerHitbox: Hitbox,
  enemyHitbox: Hitbox,
): boolean =>
  playerHitbox.left - STOMP_GRACE_X < enemyHitbox.right &&
  playerHitbox.right + STOMP_GRACE_X > enemyHitbox.left;
