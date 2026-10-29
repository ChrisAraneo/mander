import type { Enemy, Player } from '@mander/model';
import { getPlayerCentre } from '../../player/get-player-centre';
import { computeEnemyCentre } from './compute-enemy-centre';

export const isPlayerRightOfShooter = (
  shooter: Enemy,
  player: Player,
): boolean => getPlayerCentre(player).x >= computeEnemyCentre(shooter).x;
