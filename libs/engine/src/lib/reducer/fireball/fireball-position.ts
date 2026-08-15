import type { Fireball } from '@mander/model';
import type { Point } from '@mander/utils';

import { FIREBALL_ORBIT_RADIUS } from './consts';

export const fireballPosition = (
  fireball: Fireball,
  radius = FIREBALL_ORBIT_RADIUS,
): Point => ({
  x: fireball.origin.x + Math.cos(fireball.angle) * radius,
  y: fireball.origin.y + Math.sin(fireball.angle) * radius,
});
