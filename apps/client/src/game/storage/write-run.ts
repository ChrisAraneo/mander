import { pipe } from 'remeda';
import { addFinishedRun } from './internal/add-finished-run';
import { readSave } from './read-save';
import type { FinishedRun } from './types/finished-run';
import { writeSave } from './write-save';

export const writeRun = (
  run: FinishedRun,
  playedAt: string,
  random: () => number,
  storage: Storage | undefined,
): boolean =>
  pipe(
    storage,
    readSave,
    (save) => addFinishedRun(save, run, playedAt, random),
    (save) => writeSave(save, storage),
  );
