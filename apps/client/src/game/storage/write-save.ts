import { some } from 'lodash-es';
import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';
import { STORAGE_KEY } from './consts';
import { createSaveCandidates } from './internal/create-save-candidates';
import type { SaveData } from './types/save-data';

const { nonNullable } = P;

const tryWriteSave: (save: SaveData, storage: Storage | undefined) => boolean =
  tryCatch(
    (save: SaveData, storage: Storage | undefined): boolean =>
      match(storage)
        .with(nonNullable, (target) =>
          match(target.setItem(STORAGE_KEY, JSON.stringify(save))).otherwise(
            () => true,
          ),
        )
        .otherwise(() => false),
    () => false,
  );

export const writeSave = (
  save: SaveData,
  storage: Storage | undefined,
): boolean =>
  some(createSaveCandidates(save), (candidate) =>
    tryWriteSave(candidate, storage),
  );
