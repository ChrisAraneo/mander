import type { Enemy, Player } from '@mander/model';
import { isOverlappingHitbox } from '../internal/is-overlapping-hitbox';
import { computePlayerHitbox } from '../player/compute-player-hitbox';
import { computeEnemyHitbox } from './compute-enemy-hitbox';

export const isTouchingEnemy = (player: Player, enemy: Enemy): boolean =>
  isOverlappingHitbox(computePlayerHitbox(player), computeEnemyHitbox(enemy));
