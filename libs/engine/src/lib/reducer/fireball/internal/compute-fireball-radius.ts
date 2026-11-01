import type { Fireball } from '@mander/model';
import { match } from 'ts-pattern';
import { FIREBALL_ORBIT_RADIUS, PINKBALL_SPIRAL_RADIUS } from '../consts';
import { computeOrbitSpiral } from './compute-orbit-spiral';

export const computeFireballRadius = (fireball: Fireball): number =>
  match(fireball.kind)
    .with(
      'PINK',
      () =>
        FIREBALL_ORBIT_RADIUS -
        PINKBALL_SPIRAL_RADIUS * computeOrbitSpiral(fireball.angle),
    )
    .otherwise(() => FIREBALL_ORBIT_RADIUS);
