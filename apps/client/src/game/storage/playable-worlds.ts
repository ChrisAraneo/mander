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

const asPlayed = (world: CompletedWorld): PlayedWorld => ({
  name: world.name,
  day: world.day,
  playedAt: '',
  runs: 1,
});

const asPlayedRun = (run: RunRecord): PlayedWorld => ({
  name: run.name,
  day: run.day,
  playedAt: run.playedAt,
  runs: 1,
});

const keptBest = (
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

const replaysOf = (
  save: SaveData,
  name: string,
  completed: CompletedWorld | null,
): RunRecord[] =>
  chain(filter(save.runs, { name }))
    .thru((runs) =>
      concat(orderBy(runs, ['playedAt'], ['desc']), keptBest(completed, runs)),
    )
    .thru((runs) => filter(runs, isPlayable))
    .value();

const toPlayable = (save: SaveData, world: PlayedWorld): PlayableWorld =>
  chain(find(save.completedWorlds, { name: world.name }) ?? null)
    .thru((completed): PlayableWorld => ({
      ...world,
      completed,
      replays: replaysOf(save, world.name, completed),
    }))
    .value();

export const playableWorlds = (save: SaveData): PlayableWorld[] =>
  orderBy(
    map(
      unionBy(
        save.playedWorlds,
        map(save.completedWorlds, asPlayed),
        map(save.runs, asPlayedRun),
        'name',
      ),
      (world) => toPlayable(save, world),
    ),
    ['playedAt', 'day'],
    ['desc', 'desc'],
  );
