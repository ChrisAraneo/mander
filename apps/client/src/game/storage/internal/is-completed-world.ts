import { get, isObjectLike, isString } from 'lodash-es';
import type { CompletedWorld } from '../types/completed-world';

export const isCompletedWorld = (
  value: unknown,
): value is Partial<CompletedWorld> =>
  isObjectLike(value) && isString(get(value, 'name'));
