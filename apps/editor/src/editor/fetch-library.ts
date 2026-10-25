import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import { STRUCTURE_ENDPOINT } from './consts';
import { createLibraryFailure } from './internal/create-library-failure';
import { parseStructure } from './parse-structure';
import type { FetchResponse } from './types/fetch-response';
import type { LibraryResponse } from './types/library-response';
import type { StructureEntry } from './types/structure-entry';

const toStructureEntry = (entry: LibraryResponse): StructureEntry => ({
  name: entry.name,
  pool: entry.pool,
  sketch: parseStructure(entry.text),
});

export const fetchLibrary = (
  fetchResponse: FetchResponse,
): Promise<StructureEntry[]> =>
  fetchResponse(STRUCTURE_ENDPOINT).then((response) =>
    match(response.ok)
      .with(false, () => createLibraryFailure(response))
      .otherwise(() =>
        response
          .json()
          .then((body: LibraryResponse[]) => map(body, toStructureEntry)),
      ),
  );
