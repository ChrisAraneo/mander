import type { PackedReplay } from '@mander/engine';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import { withCompletedWorld } from './complete-world';
import { loadSave } from './load-save';
import { persist } from './persist';
import { runId } from './run-id';
import type { RunOutcome, RunRecord, SaveData } from './save-data';
import { withRun } from './with-run';

export interface FinishedRun {
  name: string;
  day: string;
  outcome: RunOutcome;
  score: number;
  seconds: number;
  levelIndex: number;
  replay: PackedReplay;
}

const toRecord = (run: FinishedRun, playedAt: string): RunRecord => ({
  ...run,
  id: runId(run.name, playedAt),
  playedAt,
});

const withCompletion = (save: SaveData, record: RunRecord): SaveData =>
  match(record.outcome)
    .with('COMPLETE', () =>
      withCompletedWorld(save, {
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
    chain(toRecord(run, playedAt))
      .thru((record) => withCompletion(withRun(loadSave(), record), record))
      .value(),
  );
