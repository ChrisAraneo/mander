import type { Item } from '@mander/engine';

export interface SaveData {
  inventory: Item[];
  completedLevels: string[];
  lastSeed: string | null;
}
