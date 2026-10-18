import { type Enemy, type Player, chain } from '@mander/model';
import { computePlayerHitbox } from '../../player/compute-player-hitbox';
import { computeEnemyHitbox } from '../compute-enemy-hitbox';
import { STOMP_GRACE_X } from '../consts';

export const isOverlappingHorizontally = (
  player: Player,
  enemy: Enemy,
): boolean =>
  chain({
    playerHitbox: computePlayerHitbox(player),
    enemyHitbox: computeEnemyHitbox(enemy),
  })
    .thru(
      ({ playerHitbox, enemyHitbox }) =>
        playerHitbox.left - STOMP_GRACE_X < enemyHitbox.right &&
        playerHitbox.right + STOMP_GRACE_X > enemyHitbox.left,
    )
    .value();
