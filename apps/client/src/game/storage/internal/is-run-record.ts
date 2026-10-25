import { get, isObjectLike, isString } from 'lodash-es';
import type { RunRecord } from '../types/run-record';

export const isRunRecord = (value: unknown): value is Partial<RunRecord> =>
  isObjectLike(value) && isString(get(value, 'id'));
