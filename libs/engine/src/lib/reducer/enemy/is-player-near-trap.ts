import type { Enemy, Player } from '@mander/model';
import { isAlive } from '../player/is-alive';
import { isWithinBeartrapRange } from './internal/is-within-beartrap-range';

export const isPlayerNearTrap = (trap: Enemy, player: Player): boolean =>
  isAlive(player) && isWithinBeartrapRange(trap, player);
