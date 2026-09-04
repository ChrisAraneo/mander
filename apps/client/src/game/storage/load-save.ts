import type { PackedReplay } from '@mander/engine';
import {
  compact,
  every,
  includes,
  isArray,
  isFinite,
  isObjectLike,
  isString,
} from 'lodash-es';
import { tryCatch } from 'ramda';
import { match, P } from 'ts-pattern';

import { STORAGE_KEY } from './consts';
import { emptySave } from './empty-save';
import type {
  CompletedWorld,
  PlayedWorld,
  RunOutcome,
  RunRecord,
  SaveData,
} from './save-data';

const { nonNullable, nullish, when } = P;

const OUTCOMES: readonly RunOutcome[] = Object.freeze([
  'COMPLETE',
  'GAME_OVER',
  'ABANDONED',
]);

const isSaveShape = (value: unknown): value is Partial<SaveData> =>
  isObjectLike(value);

const arrayOrEmpty = <Value>(value: unknown): Value[] =>
  match(value)
    .with(
      when((candidate): candidate is Value[] => isArray(candidate)),
      (array) => array,
    )
    .otherwise((): Value[] => []);

const numberOrZero = (value: unknown): number =>
  match(value)
    .with(
      when((candidate): candidate is number => isFinite(candidate)),
      (number) => number,
    )
    .otherwise(() => 0);

const stringOrEmpty = (value: unknown): string =>
  match(value)
    .with(
      when((candidate): candidate is string => isString(candidate)),
      (text) => text,
    )
    .otherwise(() => '');

const outcomeOrAbandoned = (value: unknown): RunOutcome =>
  match(value)
    .with(
      when((candidate): candidate is RunOutcome =>
        includes(OUTCOMES, candidate),
      ),
      (outcome) => outcome,
    )
    .otherwise((): RunOutcome => 'ABANDONED');

const isPackedEntry = (value: unknown): value is number[] =>
  isArray(value) && every(value, isFinite);

const isPackedReplay = (value: unknown): value is PackedReplay =>
  isObjectLike(value) &&
  isString((value as PackedReplay).worldName) &&
  isArray((value as PackedReplay).entries) &&
  every((value as PackedReplay).entries, isPackedEntry);

const replayOrNull = (value: unknown): PackedReplay | null =>
  match(value)
    .with(when(isPackedReplay), (replay) => replay)
    .otherwise(() => null);

const isCompletedWorld = (value: unknown): value is Partial<CompletedWorld> =>
  isObjectLike(value) && isString((value as CompletedWorld).name);

const completedWorlds = (value: unknown): CompletedWorld[] =>
  arrayOrEmpty<unknown>(value)
    .filter(isCompletedWorld)
    .map((world): CompletedWorld => ({
      name: stringOrEmpty(world.name),
      day: stringOrEmpty(world.day),
      score: numberOrZero(world.score),
      seconds: numberOrZero(world.seconds),
      runId: stringOrEmpty(world.runId),
      replay: replayOrNull(world.replay),
    }));

const isPlayedWorld = (value: unknown): value is Partial<PlayedWorld> =>
  isObjectLike(value) && isString((value as PlayedWorld).name);

const playedWorlds = (value: unknown): PlayedWorld[] =>
  arrayOrEmpty<unknown>(value)
    .filter(isPlayedWorld)
    .map((world): PlayedWorld => ({
      name: stringOrEmpty(world.name),
      day: stringOrEmpty(world.day),
      playedAt: stringOrEmpty(world.playedAt),
      runs: numberOrZero(world.runs),
    }));

const isRunRecord = (value: unknown): value is Partial<RunRecord> =>
  isObjectLike(value) && isString((value as RunRecord).id);

const runs = (value: unknown): RunRecord[] =>
  compact(
    arrayOrEmpty<unknown>(value)
      .filter(isRunRecord)
      .map((run): RunRecord | null =>
        match(replayOrNull(run.replay))
          .with(nonNullable, (replay): RunRecord => ({
            id: stringOrEmpty(run.id),
            name: stringOrEmpty(run.name),
            day: stringOrEmpty(run.day),
            playedAt: stringOrEmpty(run.playedAt),
            outcome: outcomeOrAbandoned(run.outcome),
            score: numberOrZero(run.score),
            seconds: numberOrZero(run.seconds),
            levelIndex: numberOrZero(run.levelIndex),
            replay,
          }))
          .otherwise(() => null),
      ),
  );

const fromRaw = (raw: string | null): SaveData =>
  match(raw)
    .with(nullish, () => emptySave())
    .otherwise((rawValue) =>
      match(JSON.parse(rawValue) as unknown)
        .with(when(isSaveShape), (shaped): SaveData => ({
          score: numberOrZero(shaped.score),
          completedWorlds: completedWorlds(shaped.completedWorlds),
          playedWorlds: playedWorlds(shaped.playedWorlds),
          runs: runs(shaped.runs),
        }))
        .otherwise(() => emptySave()),
    );

export const loadSave: () => SaveData = tryCatch(
  () => fromRaw(localStorage.getItem(STORAGE_KEY)),
  () => emptySave(),
);
