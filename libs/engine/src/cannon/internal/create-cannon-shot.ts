import type { Cannon } from '@mander/model';
import { match } from 'ts-pattern';
import { createFiredCannonShot } from './create-fired-cannon-shot';
import { createHeldCannonShot } from './create-held-cannon-shot';
import { getCannonRound } from './get-cannon-round';
import type { CannonShot } from './types/cannon-shot';

export const createCannonShot = (cannon: Cannon): CannonShot =>
  match(cannon.timers.reload <= 0)
    .with(true, () => createFiredCannonShot(cannon, getCannonRound(cannon)))
    .otherwise(() => createHeldCannonShot(cannon));
