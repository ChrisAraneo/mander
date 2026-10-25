import { some } from 'lodash-es';
import { createSaveCandidates } from './internal/create-save-candidates';
import { tryWriteSave } from './internal/try-write-save';
import type { SaveData } from './types/save-data';

export const writeSave = (
  save: SaveData,
  storage: Storage | undefined,
): boolean =>
  some(createSaveCandidates(save), (candidate) =>
    tryWriteSave(candidate, storage),
  );
