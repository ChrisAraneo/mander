import type { Enemy, Level, Player } from '@mander/model';
import { chain } from '@mander/utils';
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
  chain(patchLivingEnemy(level, enemy, player, deltaSeconds))
    .thru((stepped) =>
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
    )
    .value();
