import type { Enemy, Player } from '@mander/model';
import { isAlive } from '../player/is-alive';
import { isWithinBeartrapRange } from './internal/is-within-beartrap-range';

export const isPlayerNearTrap = (player: Player, trap: Enemy): boolean =>
  isAlive(player) && isWithinBeartrapRange(trap, player);
