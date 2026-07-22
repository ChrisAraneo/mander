import { STORAGE_KEY } from './constants';
import type { SaveData } from './save-data';

export function persist(save: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {}
}
