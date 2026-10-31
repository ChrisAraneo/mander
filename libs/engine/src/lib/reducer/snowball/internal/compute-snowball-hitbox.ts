import type { Snowball } from '@mander/model';
import type { Hitbox } from '../../types/hitbox';
import { SNOWBALL_HITBOX_INSET, SNOWBALL_SIZE } from '../consts';

export const computeSnowballHitbox = (snowball: Snowball): Hitbox => ({
  left: snowball.position.x + SNOWBALL_HITBOX_INSET,
  right: snowball.position.x + SNOWBALL_SIZE - SNOWBALL_HITBOX_INSET,
  top: snowball.position.y + SNOWBALL_HITBOX_INSET,
  bottom: snowball.position.y + SNOWBALL_SIZE - SNOWBALL_HITBOX_INSET,
});
