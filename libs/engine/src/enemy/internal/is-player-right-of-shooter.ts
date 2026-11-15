import type { Enemy, Player } from '@mander/model';
import { computePlayerCentre } from '../../player/compute-player-centre';
import { computeEnemyCentre } from './compute-enemy-centre';

export const isPlayerRightOfShooter = (
  shooter: Enemy,
  player: Player,
): boolean => computePlayerCentre(player).x >= computeEnemyCentre(shooter).x;
