import type { SaveData } from './save-data';

export function emptySave(): SaveData {
  return { inventory: [], completedLevels: [], lastSeed: null };
}
