import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { fetchLibrary } from './fetch-library';
import { formatErrorMessage } from './internal/format-error-message';
import { patchRef } from './patch-ref';
import type { FetchResponse } from './types/fetch-response';
import type { Library } from './types/library';

export const fetchLibraryEntries = (
  library: Library,
  fetchResponse: FetchResponse,
): Promise<void> =>
  fetchLibrary(fetchResponse)
    .then(
      (loaded) =>
        pipe(
          loaded,
          (entries) => patchRef(library.entries, entries),
          () => patchRef(library.isReady, true),
        ),
      (error: unknown) =>
        pipe(
          false,
          (isReady) => patchRef(library.isReady, isReady),
          () =>
            patchRef(
              library.status,
              `The library is out of reach — ${formatErrorMessage(error)}`,
            ),
        ),
    )
    .then(noop);
