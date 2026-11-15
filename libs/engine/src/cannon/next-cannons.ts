import type { Cannon, Player } from '@mander/model';
import { pipe } from 'remeda';
import { createCannonBarrage } from './internal/create-cannon-barrage';
import { createCannonTickShots } from './internal/create-cannon-tick-shots';
import type { Barrage } from './types/barrage';

export const nextCannons = (
  cannons: Cannon[],
  player: Player,
  deltaSeconds: number,
): Barrage =>
  pipe(
    { cannons, player, deltaSeconds },
    createCannonTickShots,
    createCannonBarrage,
  );
