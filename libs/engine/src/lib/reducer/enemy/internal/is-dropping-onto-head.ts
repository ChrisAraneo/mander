import type { Enemy, Player } from '@mander/model';
import { STOMP_GRACE_Y } from '../consts';
import { computeEnemyHead } from './compute-enemy-head';
import { computeEnemyHeadBeforeHop } from './compute-enemy-head-before-hop';
import { computePlayerFeet } from './compute-player-feet';

export const isDroppingOntoHead = (
  previousPlayer: Player,
  player: Player,
  enemy: Enemy,
  deltaSeconds: number,
): boolean =>
  computePlayerFeet(previousPlayer) <=
    computeEnemyHeadBeforeHop(enemy, deltaSeconds) + STOMP_GRACE_Y &&
  computePlayerFeet(player) >= computeEnemyHead(enemy);
