import { concat, reject } from 'lodash-es';

import { loadSave } from './load-save';
import { persist } from './persist';

export const completeWorld = (name: string, score: number): void => {
  const save = loadSave();
  const previous = save.completedWorlds.find((world) => world.name === name);

  persist({
    ...save,
    score,
    completedWorlds: concat(reject(save.completedWorlds, { name }), {
      name,
      score: Math.max(score, previous?.score ?? 0),
    }),
  });
};
