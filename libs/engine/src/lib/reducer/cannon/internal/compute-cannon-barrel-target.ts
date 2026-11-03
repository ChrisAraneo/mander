import type { Cannon } from '@mander/model';
import { match } from 'ts-pattern';
import { CANNON_AIM_SECONDS, CANNON_RESTING_ANGLE } from '../consts';
import { getCannonRound } from './get-cannon-round';

export const computeCannonBarrelTarget = (cannon: Cannon): number =>
  match(cannon.timers.reload <= CANNON_AIM_SECONDS)
    .with(true, () => getCannonRound(cannon).angle)
    .otherwise(() => CANNON_RESTING_ANGLE);
