import { type Enemy, findEnemyTiles, isSolid } from '@mander/model';
import { map } from 'lodash-es';
import { pipe } from 'remeda';
import { createRandom } from '../../../random/create-random';
import { isRollUnder } from '../../../random/is-roll-under';
import type { GameLevel } from '../../../types/game-level';
import { computeEnemySpawnX } from './compute-enemy-spawn-x';
import { computeEnemySpawnY } from './compute-enemy-spawn-y';
import { createPatrol } from './create-patrol';
import { toEnemyKind } from './to-enemy-kind';

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
