import { tryCatch } from 'ramda';

import { STORAGE_KEY } from './consts';
import type { SaveData } from './save-data';

export const persist: (save: SaveData) => void = tryCatch(
  (save: SaveData) => localStorage.setItem(STORAGE_KEY, JSON.stringify(save)),
  () => undefined,
);
