import type { GameLevel } from '../types/game-level';

export type Action =
  | { type: 'TICK' }
  | { type: 'MOVE_LEFT_START' }
  | { type: 'MOVE_LEFT_STOP' }
  | { type: 'MOVE_RIGHT_START' }
  | { type: 'MOVE_RIGHT_STOP' }
  | { type: 'JUMP_START' }
  | { type: 'JUMP_STOP' }
  | { type: 'INTERACT' }
  | { type: 'CHOOSE_ITEM'; index: number }
  | { type: 'USE_STAR' }
  | { type: 'SHOOT' }
  | { type: 'CLOSE' }
  | { type: 'LOAD_LEVEL'; level: GameLevel; levelIndex: number }
  | { type: 'RESPAWN' }
  | { type: 'RESTART'; level: GameLevel };

/** Everything a run records. A tick is the clock, not an input, so it is not here. */
export type RecordableAction = Exclude<Action, { type: 'TICK' }>;
