import type { Cannon } from '@mander/model';
import { size } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { createFiredCannonball } from '../create-fired-cannonball';
import { createHeldCannonShot } from './create-held-cannon-shot';
import { getCannonRound } from './get-cannon-round';
import { getCannonRounds } from './get-cannon-rounds';
import type { CannonShot } from './types/cannon-shot';

export const createCannonShot = (cannon: Cannon): CannonShot =>
  match(cannon.timers.reload <= 0)
    .with(true, () =>
      pipe(getCannonRound(cannon), (round): CannonShot => ({
        cannon: {
          ...cannon,
          roundIndex:
            (cannon.roundIndex + 1) % size(getCannonRounds(cannon.kind)),
          timers: { reload: cannon.timers.reload + round.reloadSeconds },
        },
        cannonball: createFiredCannonball(cannon, round.angle),
      })),
    )
    .otherwise(() => createHeldCannonShot(cannon));
