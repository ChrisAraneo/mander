import type { Player, Snowball } from '@mander/model';
import { isOverlappingHitbox } from '../internal/is-overlapping-hitbox';
import { computePlayerHitbox } from '../player/compute-player-hitbox';
import { computeSnowballHitbox } from './internal/compute-snowball-hitbox';

export const isTouchingSnowball = (
  player: Player,
  snowball: Snowball,
): boolean =>
  isOverlappingHitbox(
    computePlayerHitbox(player),
    computeSnowballHitbox(snowball),
  );
