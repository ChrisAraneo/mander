import type { PackedReplay } from '@mander/engine';
import {
  every,
  get,
  isArray,
  isFinite,
  isObjectLike,
  isString,
} from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

const isPackedEntry = (value: unknown): value is number[] =>
  isArray(value) && every(value, isFinite);

const isPackedReplay = (value: unknown): value is PackedReplay =>
  isObjectLike(value) &&
  isString(get(value, 'worldName')) &&
  isFinite(get(value, 'steps')) &&
  isArray(get(value, 'entries')) &&
  every(get(value, 'entries'), isPackedEntry);

export const parsePackedReplay = (value: unknown): PackedReplay | null =>
  match(value)
    .with(when(isPackedReplay), (replay) => replay)
    .otherwise(() => null);
