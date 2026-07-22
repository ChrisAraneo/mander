import type { Level } from '@mander/generator';
import type { Player } from './player';

export function createPlayer(level: Level): Player {
  return {
    x: level.spawn.x,
    y: level.spawn.y,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 1,
    jumpQueued: false,
  };
}
