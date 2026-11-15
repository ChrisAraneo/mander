import type { Enemy, Player } from '@mander/model';
import { computePlayerCentre } from '../../player/compute-player-centre';
import { FREEZING_RANGE } from '../consts';
import { computeEnemyCentre } from './compute-enemy-centre';

export const isPlayerInFreezingRange = (
  freezer: Enemy,
  player: Player,
): boolean =>
  Math.hypot(
    computePlayerCentre(player).x - computeEnemyCentre(freezer).x,
    computePlayerCentre(player).y - computeEnemyCentre(freezer).y,
  ) <= FREEZING_RANGE;
