import { isArray, isString } from 'lodash-es';

import { STORAGE_KEY } from './constants';
import { emptySave } from './empty-save';
import type { SaveData } from './save-data';

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      inventory: isArray(parsed.inventory) ? parsed.inventory : [],
      completedLevels: isArray(parsed.completedLevels)
        ? parsed.completedLevels
        : [],
      lastSeed: isString(parsed.lastSeed) ? parsed.lastSeed : null,
    };
  } catch {
    return emptySave();
  }
}
