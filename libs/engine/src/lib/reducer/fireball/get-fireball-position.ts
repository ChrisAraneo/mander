import type { Fireball, Point } from '@mander/model';
import { FIREBALL_ORBIT_RADIUS } from './consts';

export const getFireballPosition = (fireball: Fireball): Point => ({
  x: fireball.origin.x + Math.cos(fireball.angle) * FIREBALL_ORBIT_RADIUS,
  y: fireball.origin.y + Math.sin(fireball.angle) * FIREBALL_ORBIT_RADIUS,
});
