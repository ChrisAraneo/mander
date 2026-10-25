import {
  type Enemy,
  type EnemyKind,
  findEnemyTiles,
  isSolid,
  type Point,
} from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createRandom } from '../../../random/create-random';
import { isRollUnder } from '../../../random/is-roll-under';
import type { GameLevel } from '../../../types/game-level';
import { computeEnemySpawnX } from './compute-enemy-spawn-x';
import { computeEnemySpawnY } from './compute-enemy-spawn-y';
import { getEnemyMaxVelocityY } from './get-enemy-max-velocity-y';
import { getEnemyMoveSpeed } from './get-enemy-move-speed';
import { toEnemyKind } from './to-enemy-kind';

const createPatrol = (point: Point, kind: EnemyKind): Enemy => ({
  kind,
  position: { ...point },
  velocity: {
    x: { current: 0, max: getEnemyMoveSpeed(kind) },
    y: { current: 0, max: getEnemyMaxVelocityY(kind) },
  },
  timers: { death: null },
  spawn: { ...point },
  statuses: { isFacingRight: true, isGrounded: false },
});

export const createPatrols = (level: GameLevel): Enemy[] =>
  pipe(`${level.seed}#enemies`, createRandom, (random) =>
    map(findEnemyTiles(level), (spawn) =>
      createPatrol(
        { x: computeEnemySpawnX(spawn), y: computeEnemySpawnY(spawn) },
        toEnemyKind(
          !isSolid(level, spawn.x, spawn.y + 1),
          isRollUnder(level.hornedEnemyChance, random),
        ),
      ),
    ),
  );
