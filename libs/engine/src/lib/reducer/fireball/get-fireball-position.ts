import type { Fireball, Point } from '@mander/model';
import { FIREBALL_ORBIT_RADIUS } from './consts';

export const getFireballPosition = (
  fireball: Fireball,
  radius = FIREBALL_ORBIT_RADIUS,
): Point => ({
  x: fireball.origin.x + Math.cos(fireball.angle) * radius,
  y: fireball.origin.y + Math.sin(fireball.angle) * radius,
});
