import { concat, find, reject } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { loadSave } from './load-save';
import { persist } from './persist';
import type { CompletedWorld } from './save-data';

const best = (
  run: CompletedWorld,
  previous: CompletedWorld | undefined,
): CompletedWorld =>
  match(previous)
    .with(
      P.when(
        (earlier): earlier is CompletedWorld =>
          earlier !== undefined && earlier.score >= run.score,
      ),
      (earlier) => earlier,
    )
    .otherwise(() => run);

export const completeWorld = (run: CompletedWorld): void => {
  const save = loadSave();
  const previous = find(save.completedWorlds, { name: run.name });

  persist({
    ...save,
    score: run.score,
    completedWorlds: concat(
      reject(save.completedWorlds, { name: run.name }),
      best(run, previous),
    ),
  });
};
