import { concat, includes } from 'lodash-es';
import { loadSave } from './load-save';
import { persist } from './persist';

export function markLevelCompleted(levelSeed: string): void {
  const save = loadSave();
  if (!includes(save.completedLevels, levelSeed)) {
    persist({ ...save, completedLevels: concat(save.completedLevels, levelSeed) });
  }
}
