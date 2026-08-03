import { isArray, isFinite, isObjectLike, isString } from 'lodash-es';
import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';

import { STORAGE_KEY } from './consts';
import { emptySave } from './empty-save';
import type { CompletedWorld, SaveData } from './save-data';

const { nullish } = P;

const isSaveShape = (value: unknown): value is Partial<SaveData> =>
  isObjectLike(value);

const arrayOrEmpty = <Value>(value: unknown): Value[] =>
  match(value)
    .with(
      P.when((candidate): candidate is Value[] => isArray(candidate)),
      (array) => array,
    )
    .otherwise((): Value[] => []);

const numberOrZero = (value: unknown): number =>
  match(value)
    .with(
      P.when((candidate): candidate is number => isFinite(candidate)),
      (number) => number,
    )
    .otherwise(() => 0);

const isCompletedWorld = (value: unknown): value is CompletedWorld =>
  isObjectLike(value) && isString((value as CompletedWorld).name);

const completedWorlds = (value: unknown): CompletedWorld[] =>
  arrayOrEmpty<unknown>(value)
    .filter(isCompletedWorld)
    .map((world): CompletedWorld => ({
      name: world.name,
      score: numberOrZero(world.score),
    }));

const fromRaw = (raw: string | null): SaveData =>
  match(raw)
    .with(nullish, () => emptySave())
    .otherwise((rawValue) =>
      match(JSON.parse(rawValue) as unknown)
        .with(P.when(isSaveShape), (shaped): SaveData => ({
          score: numberOrZero(shaped.score),
          completedWorlds: completedWorlds(shaped.completedWorlds),
        }))
        .otherwise(() => emptySave()),
    );

export const loadSave: () => SaveData = tryCatch(
  () => fromRaw(localStorage.getItem(STORAGE_KEY)),
  () => emptySave(),
);
