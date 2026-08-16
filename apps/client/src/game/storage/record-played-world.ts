import { concat, find, reject, takeRight } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { PLAYED_WORLDS_KEPT } from './consts';
import { loadSave } from './load-save';
import { persist } from './persist';
import type { PlayedWorld } from './save-data';

const { nullish } = P;

export interface PlayedRun {
  name: string;
  day: string;
}

const runsAfter = (previous: PlayedWorld | undefined): number =>
  match(previous)
    .with(nullish, () => 1)
    .otherwise((earlier) => earlier.runs + 1);

export const recordPlayedWorld = (
  run: PlayedRun,
  playedAt: string = new Date().toISOString(),
): void => {
  const save = loadSave();
  const previous = find(save.playedWorlds, { name: run.name });

  persist({
    ...save,
    playedWorlds: takeRight(
      concat(reject(save.playedWorlds, { name: run.name }), {
        name: run.name,
        day: run.day,
        playedAt,
        runs: runsAfter(previous),
      }),
      PLAYED_WORLDS_KEPT,
    ),
  });
};
