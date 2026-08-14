import type { Fireball } from '@mander/model';
import type { Point } from '@mander/utils';

import { FIREBALL_ORBIT_RADIUS } from './consts';

export const fireballPosition = (fireball: Fireball): Point => ({
  x: fireball.origin.x + Math.cos(fireball.angle) * FIREBALL_ORBIT_RADIUS,
  y: fireball.origin.y + Math.sin(fireball.angle) * FIREBALL_ORBIT_RADIUS,
});
