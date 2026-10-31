import type { Enemy, Player } from '@mander/model';
import { isAlive } from '../../player/is-alive';
import { isEnemyFreezing } from './is-enemy-freezing';
import { isPlayerInFreezingRange } from './is-player-in-freezing-range';

export const isArmedFreezing = (enemy: Enemy, player: Player): boolean =>
  isEnemyFreezing(enemy) &&
  isAlive(enemy) &&
  isPlayerInFreezingRange(enemy, player);
