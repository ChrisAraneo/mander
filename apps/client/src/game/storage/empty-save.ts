import type { SaveData } from './save-data';

export const emptySave = (): SaveData => ({
  inventory: [],
  completedLevels: [],
  lastSeed: null,
});
