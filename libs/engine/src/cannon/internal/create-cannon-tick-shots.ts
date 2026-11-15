import type { Cannon, Player } from '@mander/model';
import { map } from 'lodash-es';
import { createCannonTickShot } from './create-cannon-tick-shot';
import { patchCannonAim } from './patch-cannon-aim';
import type { CannonShots } from './types/cannon-shots';

export const createCannonTickShots = ({
  cannons,
  player,
  deltaSeconds,
}: {
  cannons: Cannon[];
  player: Player;
  deltaSeconds: number;
}): CannonShots => ({
  shots: map(cannons, (cannon) =>
    createCannonTickShot(patchCannonAim(cannon, player), player, deltaSeconds),
  ),
});
