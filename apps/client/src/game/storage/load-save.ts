import type { Item } from '@mander/generator';
import { isArray, isString } from 'lodash-es';
import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';

import { STORAGE_KEY } from './constants';
import { emptySave } from './empty-save';
import type { SaveData } from './save-data';

const { nullish } = P;

const isSaveShape = (value: unknown): value is Partial<SaveData> =>
  typeof value === 'object' && value !== null;

const arrayOrEmpty = <Value>(value: unknown): Value[] =>
  match(value)
    .with(
      P.when((candidate): candidate is Value[] => isArray(candidate)),
      (array) => array,
    )
    .otherwise((): Value[] => []);

const parseSave = (raw: string | null): SaveData =>
  match(raw)
    .with(nullish, () => emptySave())
    .otherwise((rawValue) =>
      match(JSON.parse(rawValue) as unknown)
        .with(
          P.when(isSaveShape),
          (shaped): SaveData => ({
            inventory: arrayOrEmpty<Item>(shaped.inventory),
            completedLevels: arrayOrEmpty<string>(shaped.completedLevels),
            lastSeed: match(shaped.lastSeed)
              .with(P.when(isString), (value) => value)
              .otherwise(() => null),
          }),
        )
        .otherwise(() => emptySave()),
    );

export const loadSave: () => SaveData = tryCatch(
  () => parseSave(localStorage.getItem(STORAGE_KEY)),
  () => emptySave(),
);
