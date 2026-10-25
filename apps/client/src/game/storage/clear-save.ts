import { noop } from 'lodash-es';
import { tryCatch } from 'ramda';
import { STORAGE_KEY } from './consts';

export const clearSave: (storage: Storage | undefined) => void = tryCatch(
  (storage: Storage | undefined): void => storage?.removeItem(STORAGE_KEY),
  noop,
);
