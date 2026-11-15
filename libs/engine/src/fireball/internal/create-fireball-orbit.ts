import { FIREBALL_ORBIT_RADIUS } from '../consts';
import type { FireballOrbit } from './types/fireball-orbit';

export const createFireballOrbit = (angle: number): FireballOrbit => ({
  radius: FIREBALL_ORBIT_RADIUS,
  angle,
});
