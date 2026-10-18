import type { Hitbox } from '../types/hitbox';

export const isOverlappingHitbox = (
  hitbox: Hitbox,
  otherHitbox: Hitbox,
): boolean =>
  hitbox.left < otherHitbox.right &&
  hitbox.right > otherHitbox.left &&
  hitbox.top < otherHitbox.bottom &&
  hitbox.bottom > otherHitbox.top;
