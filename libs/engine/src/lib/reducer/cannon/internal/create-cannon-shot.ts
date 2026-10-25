import type { Cannon } from '@mander/model';
import { match } from 'ts-pattern';
import { CANNON_RELOAD_SECONDS } from '../consts';
import { createFiredCannonball } from '../create-fired-cannonball';
import { createHeldCannonShot } from './create-held-cannon-shot';
import type { CannonShot } from './types/cannon-shot';

export const createCannonShot = (cannon: Cannon): CannonShot =>
  match(cannon.timers.reload <= 0)
    .with(true, (): CannonShot => ({
      cannon: {
        ...cannon,
        timers: { reload: cannon.timers.reload + CANNON_RELOAD_SECONDS },
      },
      cannonball: createFiredCannonball(cannon),
    }))
    .otherwise(() => createHeldCannonShot(cannon));
