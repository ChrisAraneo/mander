import type { SaveData } from './save-data';

export const createEmptySave = (): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
});
