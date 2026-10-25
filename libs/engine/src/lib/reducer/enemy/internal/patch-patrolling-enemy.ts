import { type Enemy, type Level, type Player } from '@mander/model';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { isOverlappingSpike } from '../../spike/is-overlapping-spike';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from '../consts';
import { startEnemyDeath } from '../start-enemy-death';
import { patchLivingEnemy } from './patch-living-enemy';

export const patchPatrollingEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  deltaSeconds: number,
): Enemy =>
  pipe(
    enemy,
    (patrolling) => patchLivingEnemy(level, patrolling, player, deltaSeconds),
    (stepped) =>
      match(
        isOverlappingSpike(
          level,
          stepped.position.x,
          stepped.position.y,
          ENEMY_WIDTH,
          ENEMY_HEIGHT,
        ),
      )
        .with(true, () => startEnemyDeath(stepped))
        .otherwise(() => stepped),
  );
