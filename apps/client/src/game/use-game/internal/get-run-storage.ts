import { match } from 'ts-pattern';

const NO_STORAGE: Storage | undefined = undefined;

export const getRunStorage = (
  structureName: string | null,
  storage: Storage | undefined,
): Storage | undefined =>
  match(structureName)
    .with(null, () => storage)
    .otherwise(() => NO_STORAGE);
