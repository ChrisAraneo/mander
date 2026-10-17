import type { Cannon, Player } from '@mander/model';
import { chain } from '@mander/utils';
import { compact, map } from 'lodash-es';
import { createCannonTickShot } from './internal/create-cannon-tick-shot';
import { patchCannonAim } from './internal/patch-cannon-aim';
import type { Barrage } from './types/barrage';

export const advanceCannons = (
  cannons: Cannon[],
  player: Player,
  deltaSeconds: number,
): Barrage =>
  chain(cannons)
    .thru((mounted) =>
      map(mounted, (cannon) =>
        createCannonTickShot(
          patchCannonAim(cannon, player),
          player,
          deltaSeconds,
        ),
      ),
    )
    .thru((shots): Barrage => ({
      cannons: map(shots, (shot) => shot.cannon),
      cannonballs: compact(map(shots, (shot) => shot.cannonball)),
    }))
    .value();
