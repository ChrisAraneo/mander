import { indexOf } from 'lodash-es';
import type { RecordableAction } from '../state/types/recordable-action';
import { ACTION_CODES } from './action-codes';

export const findActionCode = (type: RecordableAction['type']): number =>
  indexOf(ACTION_CODES, type);
