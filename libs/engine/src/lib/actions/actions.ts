import type { GameLevel } from '../types/game-level';

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
  | { type: 'USE_STAR' }
  | { type: 'CLOSE' }
  | { type: 'LOAD_LEVEL'; level: GameLevel; levelIndex: number }
  | { type: 'RESPAWN' }
  | { type: 'RESTART'; level: GameLevel };
