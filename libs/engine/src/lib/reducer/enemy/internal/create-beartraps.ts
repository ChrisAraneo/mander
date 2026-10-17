import { type Enemy, findBeartrapTiles } from '@mander/model';
import { chain } from '@mander/utils';
import { map } from 'lodash-es';
import type { GameLevel } from '../../../types/game-level';
import { BEARTRAP_JUMP_VELOCITY } from '../consts';
import { computeEnemySpawnX } from './compute-enemy-spawn-x';
import { computeEnemySpawnY } from './compute-enemy-spawn-y';

export const createBeartraps = (level: GameLevel): Enemy[] =>
  map(findBeartrapTiles(level), (spawn): Enemy =>
    chain({ x: computeEnemySpawnX(spawn), y: computeEnemySpawnY(spawn) })
      .thru((point): Enemy => ({
        kind: 'BEARTRAP',
        position: { ...point },
        velocity: {
          x: { current: 0, max: 0 },
          y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
        },
        timers: { death: null },
        spawn: { ...point },
        statuses: { isFacingRight: true, isGrounded: false },
      }))
      .value(),
  );
