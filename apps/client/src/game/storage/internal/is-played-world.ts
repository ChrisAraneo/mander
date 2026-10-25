import { get, isObjectLike, isString } from 'lodash-es';
import type { PlayedWorld } from '../types/played-world';

export const isPlayedWorld = (value: unknown): value is Partial<PlayedWorld> =>
  isObjectLike(value) && isString(get(value, 'name'));
