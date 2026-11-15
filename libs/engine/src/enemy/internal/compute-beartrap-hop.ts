import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { isPlayerNearTrap } from '../is-player-near-trap';
import type { EnemyHop } from './types/enemy-hop';

export const computeBeartrapHop = (
  trap: Enemy,
  player: Player,
  velocityY: number,
  isGrounded: boolean,
): EnemyHop =>
  match({ isGrounded, isNear: isPlayerNearTrap(player, trap) })
    .with({ isGrounded: true, isNear: true }, (): EnemyHop => ({
      velocityY: -trap.velocity.y.max,
      isGrounded: false,
    }))
    .otherwise((): EnemyHop => ({ velocityY, isGrounded }));
