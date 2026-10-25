import { tryCatch } from 'ramda';
import { STORAGE_KEY } from './consts';
import { createEmptySave } from './internal/create-empty-save';
import { parseSave } from './internal/parse-save';
import type { SaveData } from './types/save-data';

export const readSave: (storage: Storage | undefined) => SaveData = tryCatch(
  (storage: Storage | undefined): SaveData =>
    parseSave(storage?.getItem(STORAGE_KEY) ?? null),
  () => createEmptySave(),
);
