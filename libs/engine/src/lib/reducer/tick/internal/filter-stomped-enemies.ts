import type { Enemy, EnemyKind, Player } from '@mander/model';
import { filter, includes } from 'lodash-es';
import { isStompingEnemy } from '../../enemy/is-stomping-enemy';
import { isAlive } from '../../player/is-alive';

const STOMP_PROOF_KINDS: readonly EnemyKind[] = Object.freeze([
  'HORNED',
  'BEARTRAP',
]);

export const filterStompedEnemies = (
  previousPlayer: Player,
  player: Player,
  enemies: Enemy[],
  deltaSeconds: number,
): Enemy[] =>
  filter(
    enemies,
    (enemy) =>
      !includes(STOMP_PROOF_KINDS, enemy.kind) &&
      isAlive(enemy) &&
      isStompingEnemy(previousPlayer, player, enemy, deltaSeconds),
  );
