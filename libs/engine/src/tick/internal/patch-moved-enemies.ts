import type { Enemy, Player } from '@mander/model';
import { filter, map } from 'lodash-es';
import { isEnemyFaded } from '../../enemy/is-enemy-faded';
import { patchEnemy } from '../../enemy/patch-enemy';
import type { GameState } from '../../state/types/game-state';

export const patchMovedEnemies = (
  state: GameState,
  player: Player,
  deltaSeconds: number,
): Enemy[] =>
  filter(
    map(state.enemies, (enemy) =>
      patchEnemy(state.level, enemy, player, deltaSeconds),
    ),
    (enemy) => !isEnemyFaded(enemy),
  );
