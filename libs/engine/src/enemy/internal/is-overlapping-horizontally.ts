import type { Enemy, Player } from '@mander/model';
import { computePlayerHitbox } from '../../player/compute-player-hitbox';
import { computeEnemyHitbox } from '../compute-enemy-hitbox';
import { isOverlappingWithinGrace } from './is-overlapping-within-grace';

export const isOverlappingHorizontally = (
  enemy: Enemy,
  player: Player,
): boolean =>
  isOverlappingWithinGrace(
    computePlayerHitbox(player),
    computeEnemyHitbox(enemy),
  );
