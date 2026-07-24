import { tryCatch } from 'ramda';

import { STORAGE_KEY } from './constants';

export const clearSave: () => void = tryCatch(
  () => localStorage.removeItem(STORAGE_KEY),
  () => undefined,
);
