import { STORAGE_KEY } from './constants';
import type { SaveData } from './save-data';

export const persist = (save: SaveData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Ignore storage errors (e.g. localStorage unavailable or full).
  }
};
