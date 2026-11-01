import type { Fireball } from '@mander/model';
import { match } from 'ts-pattern';
import { FIREBALL_ORBIT_RADIUS } from '../consts';
import { computeGermOrbit } from './compute-germ-orbit';
import type { FireballOrbit } from './types/fireball-orbit';

export const computeFireballOrbit = (fireball: Fireball): FireballOrbit =>
  match(fireball.kind)
    .with('PINK', () => computeGermOrbit(fireball.angle))
    .otherwise(() => ({
      radius: FIREBALL_ORBIT_RADIUS,
      angle: fireball.angle,
    }));
