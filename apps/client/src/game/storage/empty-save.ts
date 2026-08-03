import type { SaveData } from './save-data';

export const emptySave = (): SaveData => ({
  score: 0,
  completedWorlds: [],
});
