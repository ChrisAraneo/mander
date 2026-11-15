import type { Enemy, Player } from '@mander/model';
import { computePlayerCentre } from '../../player/compute-player-centre';
import { SHOOTER_RANGE } from '../consts';
import { computeEnemyCentre } from './compute-enemy-centre';

export const isPlayerInShooterRange = (
  shooter: Enemy,
  player: Player,
): boolean =>
  Math.hypot(
    computePlayerCentre(player).x - computeEnemyCentre(shooter).x,
    computePlayerCentre(player).y - computeEnemyCentre(shooter).y,
  ) <= SHOOTER_RANGE;
