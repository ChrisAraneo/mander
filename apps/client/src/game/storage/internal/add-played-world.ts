import { concat, find, reject, takeRight } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { PLAYED_WORLDS_KEPT } from '../consts';
import type { PlayedRun } from '../types/played-run';
import type { PlayedWorld } from '../types/played-world';
import type { SaveData } from '../types/save-data';

const { nullish } = P;

const computeRunCount = (previous: PlayedWorld | undefined): number =>
  match(previous)
    .with(nullish, () => 1)
    .otherwise((earlier) => earlier.runs + 1);

export const addPlayedWorld = (
  save: SaveData,
  run: PlayedRun,
  playedAt: string,
): SaveData => ({
  ...save,
  playedWorlds: takeRight(
    concat(reject(save.playedWorlds, { name: run.name }), {
      name: run.name,
      day: run.day,
      playedAt,
      runs: computeRunCount(find(save.playedWorlds, { name: run.name })),
    }),
    PLAYED_WORLDS_KEPT,
  ),
});
