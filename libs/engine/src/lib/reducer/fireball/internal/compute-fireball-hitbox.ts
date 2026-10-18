import type { Point } from '@mander/model';
import type { Hitbox } from '../../types/hitbox';
import { FIREBALL_HITBOX_INSET, FIREBALL_SIZE } from '../consts';

const FIREBALL_REACH = FIREBALL_SIZE / 2 - FIREBALL_HITBOX_INSET;

export const computeFireballHitbox = (centre: Point): Hitbox => ({
  left: centre.x - FIREBALL_REACH,
  right: centre.x + FIREBALL_REACH,
  top: centre.y - FIREBALL_REACH,
  bottom: centre.y + FIREBALL_REACH,
});
