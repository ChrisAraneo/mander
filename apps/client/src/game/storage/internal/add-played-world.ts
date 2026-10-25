import { concat, find, reject, takeRight } from 'lodash-es';
import { PLAYED_WORLDS_KEPT } from '../consts';
import type { PlayedRun } from '../types/played-run';
import type { SaveData } from '../types/save-data';
import { computeRunCount } from './compute-run-count';

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
