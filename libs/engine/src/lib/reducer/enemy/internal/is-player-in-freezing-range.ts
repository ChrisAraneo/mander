import type { Enemy, Player } from '@mander/model';
import { getPlayerCentre } from '../../player/get-player-centre';
import { FREEZING_RANGE } from '../consts';
import { computeEnemyCentre } from './compute-enemy-centre';

export const isPlayerInFreezingRange = (
  freezer: Enemy,
  player: Player,
): boolean =>
  Math.hypot(
    getPlayerCentre(player).x - computeEnemyCentre(freezer).x,
    getPlayerCentre(player).y - computeEnemyCentre(freezer).y,
  ) <= FREEZING_RANGE;
