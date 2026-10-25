import { type Enemy, type Player } from '@mander/model';
import { computePlayerHitbox } from '../../player/compute-player-hitbox';
import type { Hitbox } from '../../types/hitbox';
import { computeEnemyHitbox } from '../compute-enemy-hitbox';
import { STOMP_GRACE_X } from '../consts';

const isOverlappingWithinGrace = (
  playerHitbox: Hitbox,
  enemyHitbox: Hitbox,
): boolean =>
  playerHitbox.left - STOMP_GRACE_X < enemyHitbox.right &&
  playerHitbox.right + STOMP_GRACE_X > enemyHitbox.left;

export const isOverlappingHorizontally = (
  player: Player,
  enemy: Enemy,
): boolean =>
  isOverlappingWithinGrace(
    computePlayerHitbox(player),
    computeEnemyHitbox(enemy),
  );
