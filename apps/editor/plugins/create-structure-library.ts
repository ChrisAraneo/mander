import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import type { Plugin } from 'vite';
import { createStructurePaths } from './create-structure-paths.ts';
import { writeStructureResponse } from './internal/write-structure-response.ts';

const STRUCTURE_ENDPOINT = '/api/structures';

export const createStructureLibrary = (): Plugin => ({
  name: 'mander:structure-library',
  configureServer: (server) =>
    pipe(
      server.config.root,
      createStructurePaths,
      (paths) =>
        server.middlewares.use(STRUCTURE_ENDPOINT, (request, response) =>
          writeStructureResponse(paths, request, response),
        ),
      noop,
    ),
});
