import type { Cannon, Player } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { createCannonShot } from './create-cannon-shot';
import { createHeldCannonShot } from './create-held-cannon-shot';
import { isPlayerInCannonRange } from './is-player-in-cannon-range';
import { patchCannonBarrel } from './patch-cannon-barrel';
import { patchCannonCooldown } from './patch-cannon-cooldown';
import type { CannonShot } from './types/cannon-shot';

export const createCannonTickShot = (
  cannon: Cannon,
  player: Player,
  deltaSeconds: number,
): CannonShot =>
  match(isPlayerInCannonRange(cannon, player))
    .with(true, () =>
      pipe(
        cannon,
        (loading) => patchCannonCooldown(loading, deltaSeconds),
        (loading) => patchCannonBarrel(loading, deltaSeconds),
        createCannonShot,
      ),
    )
    .otherwise(() => createHeldCannonShot(cannon));
