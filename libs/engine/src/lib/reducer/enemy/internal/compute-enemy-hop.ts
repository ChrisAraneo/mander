import type { Enemy, Player } from '@mander/model';
import { match } from 'ts-pattern';
import { isPlayerOverhead } from './is-player-overhead';
import type { EnemyHop } from './types/enemy-hop';

export const computeEnemyHop = (
  isGrounded: boolean,
  velocityY: number,
  enemy: Enemy,
  player: Player,
): EnemyHop =>
  match({ isGrounded, isOverhead: isPlayerOverhead(enemy, player) })
    .with({ isGrounded: true, isOverhead: true }, (): EnemyHop => ({
      velocityY: -enemy.velocity.y.max,
      isGrounded: false,
    }))
    .otherwise((): EnemyHop => ({ velocityY, isGrounded }));
