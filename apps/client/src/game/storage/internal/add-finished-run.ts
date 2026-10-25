import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { FinishedRun } from '../types/finished-run';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { addCompletedWorld } from './add-completed-world';
import { addRun } from './add-run';
import { createRunId } from './create-run-id';

const createRunRecord = (
  run: FinishedRun,
  playedAt: string,
  random: () => number,
): RunRecord => ({
  ...run,
  id: createRunId(run.name, playedAt, random),
  playedAt,
});

const addCompletion = (save: SaveData, record: RunRecord): SaveData =>
  match(record.outcome)
    .with('COMPLETE', () =>
      addCompletedWorld(save, {
        name: record.name,
        day: record.day,
        score: record.score,
        seconds: record.seconds,
        runId: record.id,
        replay: record.replay,
      }),
    )
    .otherwise(() => save);

export const addFinishedRun = (
  save: SaveData,
  run: FinishedRun,
  playedAt: string,
  random: () => number,
): SaveData =>
  pipe(
    { save, record: createRunRecord(run, playedAt, random) },
    ({ save: previous, record }) => ({
      record,
      save: addRun(previous, record),
    }),
    ({ save: next, record }) => addCompletion(next, record),
  );
