import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { tryParseJson } from './try-parse-json';

const { nullish } = P;

export const tryParseSaveJson = (raw: string | null): unknown =>
  match(raw).with(nullish, noop).otherwise(tryParseJson);
