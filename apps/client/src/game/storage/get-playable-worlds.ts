import { concat, filter, find, map, orderBy, unionBy } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import type { CompletedWorld } from './types/completed-world';
import type { PlayableWorld } from './types/playable-world';
import type { PlayedWorld } from './types/played-world';
import type { RunRecord } from './types/run-record';
import type { SaveData } from './types/save-data';

const { nonNullable } = P;

const toPlayed = (world: CompletedWorld): PlayedWorld => ({
  name: world.name,
  day: world.day,
  playedAt: '',
  runs: 1,
});

const toPlayedFromRun = (run: RunRecord): PlayedWorld => ({
  name: run.name,
  day: run.day,
  playedAt: run.playedAt,
  runs: 1,
});

const createMissingBestRuns = (
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

const computeWorldReplays = (
  save: SaveData,
  name: string,
  completed: CompletedWorld | null,
): RunRecord[] =>
  pipe(
    filter(save.runs, { name }),
    (runs) =>
      concat(
        orderBy(runs, ['playedAt'], ['desc']),
        createMissingBestRuns(completed, runs),
      ),
    (runs) => filter(runs, isPlayable),
  );

const findCompletedWorld = (
  save: SaveData,
  name: string,
): CompletedWorld | null => find(save.completedWorlds, { name }) ?? null;

const createPlayable = (
  save: SaveData,
  world: PlayedWorld,
  completed: CompletedWorld | null,
): PlayableWorld => ({
  ...world,
  completed,
  replays: computeWorldReplays(save, world.name, completed),
});

export const getPlayableWorlds = (save: SaveData): PlayableWorld[] =>
  pipe(
    unionBy(
      save.playedWorlds,
      map(save.completedWorlds, toPlayed),
      map(save.runs, toPlayedFromRun),
      'name',
    ),
    (worlds) =>
      map(worlds, (world) =>
        createPlayable(save, world, findCompletedWorld(save, world.name)),
      ),
    (worlds) => orderBy(worlds, ['playedAt', 'day'], ['desc', 'desc']),
  );
