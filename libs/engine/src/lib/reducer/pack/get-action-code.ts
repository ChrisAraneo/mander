import { indexOf } from 'lodash-es';
import type { RecordableAction } from '../types/recordable-action';
import { ACTION_CODES } from './action-codes';

export const getActionCode = (type: RecordableAction['type']): number =>
  indexOf(ACTION_CODES, type);
