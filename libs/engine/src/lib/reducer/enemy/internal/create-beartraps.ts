import { type Enemy, findBeartrapTiles, type Point } from '@mander/model';
import { map } from 'lodash-es';
import type { GameLevel } from '../../../types/game-level';
import { BEARTRAP_JUMP_VELOCITY } from '../consts';
import { computeEnemySpawnX } from './compute-enemy-spawn-x';
import { computeEnemySpawnY } from './compute-enemy-spawn-y';

const createBeartrap = (point: Point): Enemy => ({
  kind: 'BEARTRAP',
  position: { ...point },
  velocity: {
    x: { current: 0, max: 0 },
    y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
  },
  timers: { death: null },
  spawn: { ...point },
  statuses: { isFacingRight: true, isGrounded: false },
});

export const createBeartraps = (level: GameLevel): Enemy[] =>
  map(findBeartrapTiles(level), (spawn) =>
    createBeartrap({
      x: computeEnemySpawnX(spawn),
      y: computeEnemySpawnY(spawn),
    }),
  );
