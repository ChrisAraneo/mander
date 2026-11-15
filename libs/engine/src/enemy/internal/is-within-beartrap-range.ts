import type { Enemy, Player } from '@mander/model';
import { computePlayerCentre } from '../../player/compute-player-centre';
import { BEARTRAP_TRIGGER_RANGE } from '../consts';
import { computeEnemyCentre } from './compute-enemy-centre';

export const isWithinBeartrapRange = (trap: Enemy, player: Player): boolean =>
  Math.abs(computePlayerCentre(player).x - computeEnemyCentre(trap).x) <=
  BEARTRAP_TRIGGER_RANGE;
