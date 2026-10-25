import { tryCatch } from 'ramda';
import { LAST_STRUCTURE_KEY } from './consts';

export const readLastStructure: (
  storage: Storage | undefined,
) => string | null = tryCatch(
  (storage: Storage | undefined): string | null =>
    storage?.getItem(LAST_STRUCTURE_KEY) ?? null,
  (): string | null => null,
);
