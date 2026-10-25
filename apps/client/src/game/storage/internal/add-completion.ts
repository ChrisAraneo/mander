import { match } from 'ts-pattern';
import type { RunRecord } from '../types/run-record';
import type { SaveData } from '../types/save-data';
import { addCompletedWorld } from './add-completed-world';

export const addCompletion = (save: SaveData, record: RunRecord): SaveData =>
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
