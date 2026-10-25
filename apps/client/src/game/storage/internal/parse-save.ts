import { isObjectLike, noop } from 'lodash-es';
import { tryCatch } from 'ramda';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import type { SaveData } from '../types/save-data';
import { createEmptySave } from './create-empty-save';
import { parseCompletedWorlds } from './parse-completed-worlds';
import { parseNumber } from './parse-number';
import { parsePlayedWorlds } from './parse-played-worlds';
import { parseRuns } from './parse-runs';

const { nullish, when } = P;

const isSaveShape = (value: unknown): value is Partial<SaveData> =>
  isObjectLike(value);

const tryParseJson: (raw: string) => unknown = tryCatch(
  (raw: string): unknown => JSON.parse(raw),
  noop,
);

const tryParseSaveJson = (raw: string | null): unknown =>
  match(raw).with(nullish, noop).otherwise(tryParseJson);

const toSaveData = (value: unknown): SaveData =>
  match(value)
    .with(when(isSaveShape), (shaped): SaveData => ({
      score: parseNumber(shaped.score),
      completedWorlds: parseCompletedWorlds(shaped.completedWorlds),
      playedWorlds: parsePlayedWorlds(shaped.playedWorlds),
      runs: parseRuns(shaped.runs),
    }))
    .otherwise(createEmptySave);

export const parseSave = (raw: string | null): SaveData =>
  pipe(raw, tryParseSaveJson, toSaveData);
