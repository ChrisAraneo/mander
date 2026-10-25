import { concat, find, isUndefined, reject } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { CompletedWorld } from '../types/completed-world';
import type { SaveData } from '../types/save-data';

const { when } = P;

const findBestCompletedWorld = (
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
    findBestCompletedWorld(run, find(save.completedWorlds, { name: run.name })),
  ),
});
