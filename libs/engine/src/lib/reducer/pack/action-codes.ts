import { indexOf } from 'lodash-es';

import type { RecordableAction } from '../../actions/actions';

/**
 * Ticks are never recorded, so they have no code here: a packed run is inputs
 * plus a step count. Codes are positional, so append rather than reorder.
 */

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

export const codeOf = (type: RecordableAction['type']): number =>
  indexOf(ACTION_CODES, type);
