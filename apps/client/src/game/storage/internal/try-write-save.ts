import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';
import { STORAGE_KEY } from '../consts';
import type { SaveData } from '../types/save-data';

const { nonNullable } = P;

export const tryWriteSave: (
  save: SaveData,
  storage: Storage | undefined,
) => boolean = tryCatch(
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
