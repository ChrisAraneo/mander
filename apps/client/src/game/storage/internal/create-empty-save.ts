import type { SaveData } from '../types/save-data';

export const createEmptySave = (): SaveData => ({
  score: 0,
  completedWorlds: [],
  playedWorlds: [],
  runs: [],
});
