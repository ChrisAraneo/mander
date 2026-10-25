import {
  compact,
  filter,
  get,
  includes,
  isObjectLike,
  isString,
  map,
} from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import type { RunOutcome } from '../types/run-outcome';
import type { RunRecord } from '../types/run-record';
import { parseArray } from './parse-array';
import { parseNumber } from './parse-number';
import { parsePackedReplay } from './parse-packed-replay';
import { parseString } from './parse-string';

const { nonNullable, when } = P;

const OUTCOMES: readonly RunOutcome[] = Object.freeze([
  'COMPLETE',
  'GAME_OVER',
  'ABANDONED',
]);

const parseOutcome = (value: unknown): RunOutcome =>
  match(value)
    .with(
      when((candidate): candidate is RunOutcome =>
        includes(OUTCOMES, candidate),
      ),
      (outcome) => outcome,
    )
    .otherwise((): RunOutcome => 'ABANDONED');

const isRunRecord = (value: unknown): value is Partial<RunRecord> =>
  isObjectLike(value) && isString(get(value, 'id'));

const toRunRecord = (run: Partial<RunRecord>): RunRecord | null =>
  match(parsePackedReplay(run.replay))
    .with(nonNullable, (replay): RunRecord => ({
      id: parseString(run.id),
      name: parseString(run.name),
      day: parseString(run.day),
      playedAt: parseString(run.playedAt),
      outcome: parseOutcome(run.outcome),
      score: parseNumber(run.score),
      seconds: parseNumber(run.seconds),
      levelIndex: parseNumber(run.levelIndex),
      replay,
    }))
    .otherwise(() => null);

export const parseRuns = (value: unknown): RunRecord[] =>
  pipe(
    value,
    parseArray,
    (items) => filter(items, isRunRecord),
    (runs) => map(runs, toRunRecord),
    compact,
  );
