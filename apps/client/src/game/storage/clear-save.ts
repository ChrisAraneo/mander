import { tryCatch } from 'ramda';

import { STORAGE_KEY } from './consts';

export const clearSave: () => void = tryCatch(
  () => localStorage.removeItem(STORAGE_KEY),
  () => undefined,
);
