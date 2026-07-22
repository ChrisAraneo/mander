import type { Level } from '@mander/generator';

export type Action =
  | { type: 'TICK'; deltaSeconds: number }
  | { type: 'MOVE_LEFT_START' }
  | { type: 'MOVE_LEFT_STOP' }
  | { type: 'MOVE_RIGHT_START' }
  | { type: 'MOVE_RIGHT_STOP' }
  | { type: 'JUMP_START' }
  | { type: 'JUMP_STOP' }
  | { type: 'INTERACT' }
  | { type: 'CHOOSE_ITEM'; index: number }
  | { type: 'CLOSE' }
  | { type: 'LOAD_LEVEL'; level: Level; levelIndex: number }
  | { type: 'RESPAWN' };
