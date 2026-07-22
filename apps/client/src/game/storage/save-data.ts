import type { Item } from '@mander/generator';

export interface SaveData {
  inventory: Item[];
  completedLevels: string[];
  lastSeed: string | null;
}
