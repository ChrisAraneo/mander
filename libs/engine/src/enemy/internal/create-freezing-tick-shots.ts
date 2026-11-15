import type { Enemy, Player } from '@mander/model';
import { map } from 'lodash-es';
import { createFreezingTickShot } from './create-freezing-tick-shot';
import type { FreezingShot } from './types/freezing-shot';

export const createFreezingTickShots = ({
  enemies,
  player,
  deltaSeconds,
}: {
  enemies: Enemy[];
  player: Player;
  deltaSeconds: number;
}): FreezingShot[] =>
  map(enemies, (enemy) => createFreezingTickShot(enemy, player, deltaSeconds));
