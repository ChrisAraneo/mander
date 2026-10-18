import type { Cannonball, Player } from '@mander/model';
import { isOverlappingHitbox } from '../internal/is-overlapping-hitbox';
import { computePlayerHitbox } from '../player/compute-player-hitbox';
import { computeCannonballHitbox } from './internal/compute-cannonball-hitbox';

export const isTouchingCannonball = (
  player: Player,
  cannonball: Cannonball,
): boolean =>
  isOverlappingHitbox(
    computePlayerHitbox(player),
    computeCannonballHitbox(cannonball),
  );
