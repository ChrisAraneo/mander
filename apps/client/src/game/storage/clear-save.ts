import { STORAGE_KEY } from './constants';

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
