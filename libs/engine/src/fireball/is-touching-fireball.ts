import type { Fireball, Player } from '@mander/model';
import { isOverlappingHitbox } from '../collision/is-overlapping-hitbox';
import { computePlayerHitbox } from '../player/compute-player-hitbox';
import { computeFireballPosition } from './compute-fireball-position';
import { computeFireballHitbox } from './internal/compute-fireball-hitbox';

export const isTouchingFireball = (
  player: Player,
  fireball: Fireball,
): boolean =>
  isOverlappingHitbox(
    computePlayerHitbox(player),
    computeFireballHitbox(computeFireballPosition(fireball)),
  );
