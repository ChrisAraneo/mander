import type { Layers } from '@mander/model';
import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { fetchLibraryEntries } from './fetch-library-entries';
import { formatStructure } from './format-structure';
import { formatErrorMessage } from './internal/format-error-message';
import { formatSavedStatus } from './internal/format-saved-status';
import { patchRef } from './patch-ref';
import type { FetchResponse } from './types/fetch-response';
import type { Library } from './types/library';
import { writeStructure } from './write-structure';

export const writeLibraryStructure = (
  library: Library,
  name: string,
  sketch: Layers,
  fetchResponse: FetchResponse,
): Promise<void> =>
  writeStructure(name, formatStructure(sketch), fetchResponse)
    .then(
      (saved) =>
        pipe(
          saved,
          formatSavedStatus,
          (status) => patchRef(library.status, status),
          () => fetchLibraryEntries(library, fetchResponse),
        ),
      (error: unknown) =>
        patchRef(
          library.status,
          `Nothing saved — ${formatErrorMessage(error)}`,
        ),
    )
    .then(noop);
