import type { Enemy, Player } from '@mander/model';
import { pipe } from 'remeda';
import { createSalvo } from './internal/create-salvo';
import { createShooterTickShots } from './internal/create-shooter-tick-shots';
import type { Salvo } from './types/salvo';

export const nextShooters = (
  enemies: Enemy[],
  player: Player,
  deltaSeconds: number,
): Salvo =>
  pipe({ enemies, player, deltaSeconds }, createShooterTickShots, createSalvo);
