import type { Action } from '../../actions/actions';

export const ACTION_CODES: readonly Action['type'][] = Object.freeze([
  'TICK',
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

export const codeOf = (type: Action['type']): number =>
  ACTION_CODES.indexOf(type);
