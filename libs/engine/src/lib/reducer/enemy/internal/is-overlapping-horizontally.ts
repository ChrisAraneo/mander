import { type Enemy, type Player } from '@mander/model';
import { computePlayerHitbox } from '../../player/compute-player-hitbox';
import { computeEnemyHitbox } from '../compute-enemy-hitbox';
import { isOverlappingWithinGrace } from './is-overlapping-within-grace';

export const isOverlappingHorizontally = (
  player: Player,
  enemy: Enemy,
): boolean =>
  isOverlappingWithinGrace(
    computePlayerHitbox(player),
    computeEnemyHitbox(enemy),
  );
