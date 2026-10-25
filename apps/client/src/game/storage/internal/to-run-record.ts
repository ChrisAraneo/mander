import { match, P } from 'ts-pattern';
import type { RunRecord } from '../types/run-record';
import { parseNumber } from './parse-number';
import { parseOutcome } from './parse-outcome';
import { parsePackedReplay } from './parse-packed-replay';
import { parseString } from './parse-string';

const { nonNullable } = P;

export const toRunRecord = (run: Partial<RunRecord>): RunRecord | null =>
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
