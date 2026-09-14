import { chain } from '@mander/utils';
import { concat, filter, find, map, orderBy, unionBy } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type {
  CompletedWorld,
  PlayedWorld,
  RunRecord,
  SaveData,
} from './save-data';

const { nonNullable } = P;

export interface PlayableWorld {
  name: string;
  day: string;
  playedAt: string;
  runs: number;
  completed: CompletedWorld | null;
  replays: RunRecord[];
}

const convertToPlayed = (world: CompletedWorld): PlayedWorld => ({
  name: world.name,
  day: world.day,
  playedAt: '',
  runs: 1,
});

const convertRunToPlayed = (run: RunRecord): PlayedWorld => ({
  name: run.name,
  day: run.day,
  playedAt: run.playedAt,
  runs: 1,
});

const keepBest = (
  completed: CompletedWorld | null,
  runs: RunRecord[],
): RunRecord[] =>
  match(completed)
    .with({ replay: nonNullable }, (world) =>
      match(find(runs, { id: world.runId }))
        .with(nonNullable, (): RunRecord[] => [])
        .otherwise((): RunRecord[] => [
          {
            id: `${world.name}:best`,
            name: world.name,
            day: world.day,
            playedAt: '',
            outcome: 'COMPLETE',
            score: world.score,
            seconds: world.seconds,
            levelIndex: 0,
            replay: world.replay,
          },
        ]),
    )
    .otherwise((): RunRecord[] => []);

const isPlayable = (run: RunRecord): boolean => run.day !== '';

const findReplays = (
  save: SaveData,
  name: string,
  completed: CompletedWorld | null,
): RunRecord[] =>
  chain(filter(save.runs, { name }))
    .thru((runs) =>
      concat(orderBy(runs, ['playedAt'], ['desc']), keepBest(completed, runs)),
    )
    .thru((runs) => filter(runs, isPlayable))
    .value();

const createPlayable = (save: SaveData, world: PlayedWorld): PlayableWorld =>
  chain(find(save.completedWorlds, { name: world.name }) ?? null)
    .thru((completed): PlayableWorld => ({
      ...world,
      completed,
      replays: findReplays(save, world.name, completed),
    }))
    .value();

export const listPlayableWorlds = (save: SaveData): PlayableWorld[] =>
  orderBy(
    map(
      unionBy(
        save.playedWorlds,
        map(save.completedWorlds, convertToPlayed),
        map(save.runs, convertRunToPlayed),
        'name',
      ),
      (world) => createPlayable(save, world),
    ),
    ['playedAt', 'day'],
    ['desc', 'desc'],
  );
