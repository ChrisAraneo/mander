import type { PackedReplay } from '@mander/engine';
import {
  every,
  get,
  isArray,
  isFinite,
  isObjectLike,
  isString,
} from 'lodash-es';
import { isPackedEntry } from './is-packed-entry';

export const isPackedReplay = (value: unknown): value is PackedReplay =>
  isObjectLike(value) &&
  isString(get(value, 'worldName')) &&
  isFinite(get(value, 'steps')) &&
  isArray(get(value, 'entries')) &&
  every(get(value, 'entries'), isPackedEntry);
