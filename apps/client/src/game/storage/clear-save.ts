import { tryCatch } from 'ramda';
import { noop } from 'lodash-es';

import { STORAGE_KEY } from './consts';

export const clearSave: () => void = tryCatch(
  () => localStorage.removeItem(STORAGE_KEY),
  noop,
);
