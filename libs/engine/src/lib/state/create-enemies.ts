import { map } from 'lodash-es';
import { TILE_SIZE, type Level } from '@mander/generator';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from './constants';
import type { Enemy } from './enemy';

export function createEnemies(level: Level): Enemy[] {
  return map(level.enemies, (spawn) => {
    const x = spawn.x + (TILE_SIZE - ENEMY_WIDTH) / 2;
    const y = spawn.y + TILE_SIZE - ENEMY_HEIGHT;
    return { x, y, vx: 0, vy: 0, facing: 1 as const, grounded: false, homeX: x, homeY: y };
  });
}
