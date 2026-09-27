import type { Enemy, Player } from '@mander/model';

import { getPlayerCentre } from '../player/get-player-centre';
import { isAlive } from '../player/is-alive';
import { BEARTRAP_TRIGGER_RANGE } from './consts';
import { getEnemyCentre } from './get-enemy-centre';

const isWithinRange = (trap: Enemy, player: Player): boolean =>
  Math.abs(getPlayerCentre(player).x - getEnemyCentre(trap).x) <=
  BEARTRAP_TRIGGER_RANGE;

export const isPlayerNearTrap = (trap: Enemy, player: Player): boolean =>
  isAlive(player) && isWithinRange(trap, player);
