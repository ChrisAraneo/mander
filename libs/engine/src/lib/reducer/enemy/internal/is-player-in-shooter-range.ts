import type { Enemy, Player } from '@mander/model';
import { getPlayerCentre } from '../../player/get-player-centre';
import { SHOOTER_RANGE } from '../consts';
import { computeEnemyCentre } from './compute-enemy-centre';

export const isPlayerInShooterRange = (
  shooter: Enemy,
  player: Player,
): boolean =>
  Math.hypot(
    getPlayerCentre(player).x - computeEnemyCentre(shooter).x,
    getPlayerCentre(player).y - computeEnemyCentre(shooter).y,
  ) <= SHOOTER_RANGE;
