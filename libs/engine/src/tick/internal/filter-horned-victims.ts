import type { Enemy, EnemyKind, Player } from '@mander/model';
import { filter, includes } from 'lodash-es';
import { match } from 'ts-pattern';
import { isTouchingEnemy } from '../../enemy/is-touching-enemy';
import { isAlive } from '../../player/is-alive';

const HORNED_KINDS: readonly EnemyKind[] = Object.freeze(['HORNED', 'SHOOTER']);

export const filterHornedVictims = (
  player: Player,
  enemies: Enemy[],
): Enemy[] =>
  match(player.timers.invincibility <= 0)
    .with(true, () =>
      filter(
        enemies,
        (enemy) =>
          includes(HORNED_KINDS, enemy.kind) &&
          isAlive(enemy) &&
          isTouchingEnemy(player, enemy),
      ),
    )
    .otherwise((): Enemy[] => []);
