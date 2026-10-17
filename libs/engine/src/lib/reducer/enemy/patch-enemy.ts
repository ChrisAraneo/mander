import type { Enemy, Level, Player } from '@mander/model';
import { match, P } from 'ts-pattern';
import { patchFadingEnemy } from './internal/patch-fading-enemy';
import { patchPatrollingEnemy } from './internal/patch-patrolling-enemy';

const { number } = P;

export const patchEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy =>
  match(enemy.timers.death)
    .with(number, (death) =>
      patchFadingEnemy(level, enemy, death, deltaSeconds),
    )
    .otherwise(() => patchPatrollingEnemy(level, enemy, player, deltaSeconds));
