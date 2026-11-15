import type { Enemy, Player } from '@mander/model';
import { map } from 'lodash-es';
import { createShooterTickShot } from './create-shooter-tick-shot';
import type { ShooterShot } from './types/shooter-shot';

export const createShooterTickShots = ({
  enemies,
  player,
  deltaSeconds,
}: {
  enemies: Enemy[];
  player: Player;
  deltaSeconds: number;
}): ShooterShot[] =>
  map(enemies, (enemy) => createShooterTickShot(enemy, player, deltaSeconds));
