import { STORAGE_KEY } from './constants';

export const clearSave = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors (e.g. localStorage unavailable or full).
  }
};
