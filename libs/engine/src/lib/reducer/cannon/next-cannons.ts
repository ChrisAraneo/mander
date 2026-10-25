import { type Cannon, type Player } from '@mander/model';
import { compact, map } from 'lodash-es';
import { pipe } from 'remeda';
import { createCannonTickShot } from './internal/create-cannon-tick-shot';
import { patchCannonAim } from './internal/patch-cannon-aim';
import type { Barrage } from './types/barrage';

export const nextCannons = (
  cannons: Cannon[],
  player: Player,
  deltaSeconds: number,
): Barrage =>
  pipe(
    cannons,
    (mounted) =>
      map(mounted, (cannon) =>
        createCannonTickShot(
          patchCannonAim(cannon, player),
          player,
          deltaSeconds,
        ),
      ),
    (shots): Barrage => ({
      cannons: map(shots, (shot) => shot.cannon),
      cannonballs: compact(map(shots, (shot) => shot.cannonball)),
    }),
  );
