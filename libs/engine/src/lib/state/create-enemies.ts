import { type Level, TILE_SIZE } from '@mander/generator';
import { map } from 'lodash-es';

import { ENEMY_HEIGHT, ENEMY_WIDTH } from './constants';
import type { Enemy } from './enemy';

export const createEnemies = (level: Level): Enemy[] =>
  map(level.enemies, (spawn) => {
    const x = spawn.x + (TILE_SIZE - ENEMY_WIDTH) / 2;
    const y = spawn.y + TILE_SIZE - ENEMY_HEIGHT;
    return {
      x,
      y,
      vx: 0,
      vy: 0,
      facing: 1 as const,
      isGrounded: false,
      homeX: x,
      homeY: y,
    };
  });
