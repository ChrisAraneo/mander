import type { Cannon, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { createCannonShot } from './create-cannon-shot';
import { createHeldCannonShot } from './create-held-cannon-shot';
import { isPlayerInCannonRange } from './is-player-in-cannon-range';
import { patchCannonCooldown } from './patch-cannon-cooldown';
import type { CannonShot } from './types/cannon-shot';

export const createCannonTickShot = (
  cannon: Cannon,
  player: Player,
  deltaSeconds: number,
): CannonShot =>
  match(isPlayerInCannonRange(cannon, player))
    .with(true, () =>
      createCannonShot(patchCannonCooldown(cannon, deltaSeconds)),
    )
    .otherwise(() => createHeldCannonShot(cannon));
