import { match } from 'ts-pattern';
import { STRUCTURE_ENDPOINT } from './consts';
import { createLibraryFailure } from './internal/create-library-failure';
import type { FetchResponse } from './types/fetch-response';
import type { SavedStructure } from './types/saved-structure';

export const writeStructure = (
  name: string,
  text: string,
  fetchResponse: FetchResponse,
): Promise<SavedStructure> =>
  fetchResponse(STRUCTURE_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, text }),
  }).then((response) =>
    match(response.ok)
      .with(false, () => createLibraryFailure(response))
      .otherwise((): Promise<SavedStructure> => response.json()),
  );
