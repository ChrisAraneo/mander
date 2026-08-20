import type { Enemy, Player } from '@mander/model';

import { playerCentre } from '../player/player-centre';
import { isAlive } from '../player/is-alive';
import { BEARTRAP_TRIGGER_RANGE } from './consts';
import { enemyCentre } from './enemy-centre';

const isWithinRange = (trap: Enemy, player: Player): boolean =>
  Math.hypot(
    playerCentre(player).x - enemyCentre(trap).x,
    playerCentre(player).y - enemyCentre(trap).y,
  ) <= BEARTRAP_TRIGGER_RANGE;

export const playerNearTrap = (trap: Enemy, player: Player): boolean =>
  isAlive(player) && isWithinRange(trap, player);
