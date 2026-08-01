import { type Enemy, findEnemyTiles, type Level, TILE_SIZE } from '@mander/model';
import { map } from 'lodash-es';

import {
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
} from './consts';

export const createEnemies = (level: Level): Enemy[] =>
  map(findEnemyTiles(level), (spawn) => {
    const x = spawn.x * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;
    const y = (spawn.y + 1) * TILE_SIZE - ENEMY_HEIGHT;

    return {
      position: { x, y },
      velocity: {
        x: { current: 0, max: ENEMY_MOVE_SPEED },
        y: { current: 0, max: ENEMY_JUMP_VELOCITY },
      },
      timers: { death: null },
      spawn: { x, y },
      statuses: { isFacingRight: true, isGrounded: false },
    };
  });
