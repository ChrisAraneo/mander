import { pipe } from 'remeda';
import { addPlayedWorld } from './internal/add-played-world';
import { readSave } from './read-save';
import type { PlayedRun } from './types/played-run';
import { writeSave } from './write-save';

export const writePlayedWorld = (
  run: PlayedRun,
  playedAt: string,
  storage: Storage | undefined,
): boolean =>
  pipe(
    storage,
    readSave,
    (save) => addPlayedWorld(save, run, playedAt),
    (save) => writeSave(save, storage),
  );
