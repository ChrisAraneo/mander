import type { RecordableAction } from '../types/recordable-action';

export const ACTION_CODES: readonly RecordableAction['type'][] = Object.freeze([
  'MOVE_LEFT_START',
  'MOVE_LEFT_STOP',
  'MOVE_RIGHT_START',
  'MOVE_RIGHT_STOP',
  'JUMP_START',
  'JUMP_STOP',
  'INTERACT',
  'CHOOSE_ITEM',
  'CLOSE',
  'LOAD_LEVEL',
  'RESPAWN',
  'RESTART',
  'USE_STAR',
  'SHOOT',
]);
