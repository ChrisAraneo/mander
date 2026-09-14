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
import { createEmptySave } from './create-empty-save';
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

const parseArray = <Value>(value: unknown): Value[] =>
  match(value)
    .with(
      when((candidate): candidate is Value[] => isArray(candidate)),
      (array) => array,
    )
    .otherwise((): Value[] => []);

const parseNumber = (value: unknown): number =>
  match(value)
    .with(
      when((candidate): candidate is number => isFinite(candidate)),
      (number) => number,
    )
    .otherwise(() => 0);

const parseString = (value: unknown): string =>
  match(value)
    .with(
      when((candidate): candidate is string => isString(candidate)),
      (text) => text,
    )
    .otherwise(() => '');

const parseOutcome = (value: unknown): RunOutcome =>
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
  isFinite((value as PackedReplay).steps) &&
  isArray((value as PackedReplay).entries) &&
  every((value as PackedReplay).entries, isPackedEntry);

const parseReplay = (value: unknown): PackedReplay | null =>
  match(value)
    .with(when(isPackedReplay), (replay) => replay)
    .otherwise(() => null);

const isCompletedWorld = (value: unknown): value is Partial<CompletedWorld> =>
  isObjectLike(value) && isString((value as CompletedWorld).name);

const parseCompletedWorlds = (value: unknown): CompletedWorld[] =>
  parseArray<unknown>(value)
    .filter(isCompletedWorld)
    .map((world): CompletedWorld => ({
      name: parseString(world.name),
      day: parseString(world.day),
      score: parseNumber(world.score),
      seconds: parseNumber(world.seconds),
      runId: parseString(world.runId),
      replay: parseReplay(world.replay),
    }));

const isPlayedWorld = (value: unknown): value is Partial<PlayedWorld> =>
  isObjectLike(value) && isString((value as PlayedWorld).name);

const parsePlayedWorlds = (value: unknown): PlayedWorld[] =>
  parseArray<unknown>(value)
    .filter(isPlayedWorld)
    .map((world): PlayedWorld => ({
      name: parseString(world.name),
      day: parseString(world.day),
      playedAt: parseString(world.playedAt),
      runs: parseNumber(world.runs),
    }));

const isRunRecord = (value: unknown): value is Partial<RunRecord> =>
  isObjectLike(value) && isString((value as RunRecord).id);

const parseRuns = (value: unknown): RunRecord[] =>
  compact(
    parseArray<unknown>(value)
      .filter(isRunRecord)
      .map((run): RunRecord | null =>
        match(parseReplay(run.replay))
          .with(nonNullable, (replay): RunRecord => ({
            id: parseString(run.id),
            name: parseString(run.name),
            day: parseString(run.day),
            playedAt: parseString(run.playedAt),
            outcome: parseOutcome(run.outcome),
            score: parseNumber(run.score),
            seconds: parseNumber(run.seconds),
            levelIndex: parseNumber(run.levelIndex),
            replay,
          }))
          .otherwise(() => null),
      ),
  );

const parseRawSave = (raw: string | null): SaveData =>
  match(raw)
    .with(nullish, () => createEmptySave())
    .otherwise((rawValue) =>
      match(JSON.parse(rawValue) as unknown)
        .with(when(isSaveShape), (shaped): SaveData => ({
          score: parseNumber(shaped.score),
          completedWorlds: parseCompletedWorlds(shaped.completedWorlds),
          playedWorlds: parsePlayedWorlds(shaped.playedWorlds),
          runs: parseRuns(shaped.runs),
        }))
        .otherwise(() => createEmptySave()),
    );

export const loadSave: () => SaveData = tryCatch(
  () => parseRawSave(localStorage.getItem(STORAGE_KEY)),
  () => createEmptySave(),
);
