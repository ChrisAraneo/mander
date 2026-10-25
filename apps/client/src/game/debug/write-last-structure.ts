import { noop } from 'lodash-es';
import { tryCatch } from 'ramda';
import { LAST_STRUCTURE_KEY } from './consts';

export const writeLastStructure: (
  structureName: string,
  storage: Storage | undefined,
) => void = tryCatch(
  (structureName: string, storage: Storage | undefined): void =>
    storage?.setItem(LAST_STRUCTURE_KEY, structureName),
  noop,
);
