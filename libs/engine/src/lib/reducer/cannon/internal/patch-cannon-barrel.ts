import type { Cannon } from '@mander/model';
import { clamp } from 'lodash-es';
import { CANNON_BARREL_TURN_SPEED } from '../consts';
import { computeCannonBarrelTarget } from './compute-cannon-barrel-target';

export const patchCannonBarrel = (
  cannon: Cannon,
  deltaSeconds: number,
): Cannon => ({
  ...cannon,
  barrelAngle: clamp(
    computeCannonBarrelTarget(cannon),
    cannon.barrelAngle - CANNON_BARREL_TURN_SPEED * deltaSeconds,
    cannon.barrelAngle + CANNON_BARREL_TURN_SPEED * deltaSeconds,
  ),
});
