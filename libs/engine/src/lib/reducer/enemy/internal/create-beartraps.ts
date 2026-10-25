import { type Enemy, findBeartrapTiles } from '@mander/model';
import { map } from 'lodash-es';
import type { GameLevel } from '../../../types/game-level';
import { computeEnemySpawnX } from './compute-enemy-spawn-x';
import { computeEnemySpawnY } from './compute-enemy-spawn-y';
import { createBeartrap } from './create-beartrap';

export const createBeartraps = (level: GameLevel): Enemy[] =>
  map(findBeartrapTiles(level), (spawn) =>
    createBeartrap({
      x: computeEnemySpawnX(spawn),
      y: computeEnemySpawnY(spawn),
    }),
  );
