import type { Enemy } from '@mander/model';
import { type Level, TILE_SIZE } from '../world';
import { map } from 'lodash-es';

import {
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
} from './constants';

export const createEnemies = (level: Level): Enemy[] =>
  map(level.enemies, (spawn) => {
    const x = spawn.x + (TILE_SIZE - ENEMY_WIDTH) / 2;
    const y = spawn.y + TILE_SIZE - ENEMY_HEIGHT;
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
