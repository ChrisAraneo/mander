import { match, P } from 'ts-pattern';
import type { SaveData } from '../types/save-data';
import { createEmptySave } from './create-empty-save';
import { isSaveShape } from './is-save-shape';
import { parseCompletedWorlds } from './parse-completed-worlds';
import { parseNumber } from './parse-number';
import { parsePlayedWorlds } from './parse-played-worlds';
import { parseRuns } from './parse-runs';

const { when } = P;

export const toSaveData = (value: unknown): SaveData =>
  match(value)
    .with(when(isSaveShape), (shaped): SaveData => ({
      score: parseNumber(shaped.score),
      completedWorlds: parseCompletedWorlds(shaped.completedWorlds),
      playedWorlds: parsePlayedWorlds(shaped.playedWorlds),
      runs: parseRuns(shaped.runs),
    }))
    .otherwise(createEmptySave);
