import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { SavedStructure } from '../types/saved-structure';

export const formatSavedStatus = (saved: SavedStructure): string =>
  pipe(
    saved.isCreated,
    (isCreated) =>
      match(isCreated)
        .with(true, () => 'Wrote')
        .otherwise(() => 'Updated'),
    (verb) => `${verb} ${saved.name} in ${saved.pool}.ts`,
  );
