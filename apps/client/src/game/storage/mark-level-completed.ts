import { concat, includes } from 'lodash-es';
import { match } from 'ts-pattern';

import { loadSave } from './load-save';
import { persist } from './persist';

export const markLevelCompleted = (levelSeed: string): void => {
  const save = loadSave();
  match(includes(save.completedLevels, levelSeed))
    .with(true, () => undefined)
    .otherwise(() =>
      persist({
        ...save,
        completedLevels: concat(save.completedLevels, levelSeed),
      }),
    );
};
