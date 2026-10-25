import { tryCatch } from 'ramda';

const NO_STORAGE: Storage | undefined = undefined;

export const tryGetLocalStorage: () => Storage | undefined = tryCatch(
  (): Storage => window.localStorage,
  () => NO_STORAGE,
);
