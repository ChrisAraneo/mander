import type { Enemy, Player } from '@mander/model';
import { filter } from 'lodash-es';
import { match } from 'ts-pattern';
import { isTouchingEnemy } from '../../enemy/is-touching-enemy';
import { isAlive } from '../../player/is-alive';

export const filterHornedVictims = (
  player: Player,
  enemies: Enemy[],
): Enemy[] =>
  match(player.timers.invincibility <= 0)
    .with(true, () =>
      filter(
        enemies,
        (enemy) =>
          enemy.kind === 'HORNED' &&
          isAlive(enemy) &&
          isTouchingEnemy(player, enemy),
      ),
    )
    .otherwise((): Enemy[] => []);
