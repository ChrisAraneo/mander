import type { PackedReplay } from '@mander/engine';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import { addCompletedWorld } from './complete-world';
import { loadSave } from './load-save';
import { persist } from './persist';
import { createRunId } from './create-run-id';
import type { RunOutcome, RunRecord, SaveData } from './save-data';
import { addRun } from './add-run';

export interface FinishedRun {
  name: string;
  day: string;
  outcome: RunOutcome;
  score: number;
  seconds: number;
  levelIndex: number;
  replay: PackedReplay;
}

const createRunRecord = (run: FinishedRun, playedAt: string): RunRecord => ({
  ...run,
  id: createRunId(run.name, playedAt),
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

export const archiveRun = (
  run: FinishedRun,
  playedAt: string = new Date().toISOString(),
): void =>
  persist(
    chain(createRunRecord(run, playedAt))
      .thru((record) => addCompletion(addRun(loadSave(), record), record))
      .value(),
  );
