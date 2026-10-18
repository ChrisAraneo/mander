import type { Fireball, Player } from '@mander/model';
import { isOverlappingHitbox } from '../internal/is-overlapping-hitbox';
import { computePlayerHitbox } from '../player/compute-player-hitbox';
import { getFireballPosition } from './get-fireball-position';
import { computeFireballHitbox } from './internal/compute-fireball-hitbox';

export const isTouchingFireball = (
  player: Player,
  fireball: Fireball,
): boolean =>
  isOverlappingHitbox(
    computePlayerHitbox(player),
    computeFireballHitbox(getFireballPosition(fireball)),
  );
