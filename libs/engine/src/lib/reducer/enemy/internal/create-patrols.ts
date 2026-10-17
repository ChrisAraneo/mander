import { type Enemy, findEnemyTiles, isSolid } from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import { map } from 'lodash-es';
import type { GameLevel } from '../../../types/game-level';
import { computeEnemySpawnX } from './compute-enemy-spawn-x';
import { computeEnemySpawnY } from './compute-enemy-spawn-y';
import { getEnemyMaxVelocityY } from './get-enemy-max-velocity-y';
import { getEnemyMoveSpeed } from './get-enemy-move-speed';
import { toEnemyKind } from './to-enemy-kind';

export const createPatrols = (level: GameLevel): Enemy[] =>
  chain(createRandom(`${level.seed}#enemies`))
    .thru((random) =>
      map(findEnemyTiles(level), (spawn): Enemy =>
        chain({
          point: { x: computeEnemySpawnX(spawn), y: computeEnemySpawnY(spawn) },
          kind: toEnemyKind(
            !isSolid(level, spawn.x, spawn.y + 1),
            random.isRollUnder(level.hornedEnemyChance),
          ),
        })
          .thru(({ point, kind }): Enemy => ({
            kind,
            position: { ...point },
            velocity: {
              x: { current: 0, max: getEnemyMoveSpeed(kind) },
              y: { current: 0, max: getEnemyMaxVelocityY(kind) },
            },
            timers: { death: null },
            spawn: { ...point },
            statuses: { isFacingRight: true, isGrounded: false },
          }))
          .value(),
      ),
    )
    .value();
