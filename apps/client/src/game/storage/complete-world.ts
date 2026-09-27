import { concat, find, isUndefined, reject } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { CompletedWorld, SaveData } from './save-data';

const { when } = P;

const pickBest = (
  run: CompletedWorld,
  previous: CompletedWorld | undefined,
): CompletedWorld =>
  match(previous)
    .with(
      when(
        (earlier): earlier is CompletedWorld =>
          !isUndefined(earlier) && earlier.score >= run.score,
      ),
      (earlier) => earlier,
    )
    .otherwise(() => run);

export const addCompletedWorld = (
  save: SaveData,
  run: CompletedWorld,
): SaveData => ({
  ...save,
  score: run.score,
  completedWorlds: concat(
    reject(save.completedWorlds, { name: run.name }),
    pickBest(run, find(save.completedWorlds, { name: run.name })),
  ),
});
