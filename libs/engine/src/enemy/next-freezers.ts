import type { Enemy, Player } from '@mander/model';
import { pipe } from 'remeda';
import { createBlizzard } from './internal/create-blizzard';
import { createFreezingTickShots } from './internal/create-freezing-tick-shots';
import type { Blizzard } from './types/blizzard';

export const nextFreezers = (
  enemies: Enemy[],
  player: Player,
  deltaSeconds: number,
): Blizzard =>
  pipe(
    { enemies, player, deltaSeconds },
    createFreezingTickShots,
    createBlizzard,
  );
