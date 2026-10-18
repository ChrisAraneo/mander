import type { Cannonball } from '@mander/model';
import type { Hitbox } from '../../types/hitbox';
import { CANNONBALL_HITBOX_INSET, CANNONBALL_SIZE } from '../consts';

export const computeCannonballHitbox = (cannonball: Cannonball): Hitbox => ({
  left: cannonball.position.x + CANNONBALL_HITBOX_INSET,
  right: cannonball.position.x + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET,
  top: cannonball.position.y + CANNONBALL_HITBOX_INSET,
  bottom: cannonball.position.y + CANNONBALL_SIZE - CANNONBALL_HITBOX_INSET,
});
