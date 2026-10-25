import { pipe } from 'remeda';
import type { FinishedRun } from '../types/finished-run';
import type { SaveData } from '../types/save-data';
import { addCompletion } from './add-completion';
import { addRun } from './add-run';
import { createRunRecord } from './create-run-record';

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
