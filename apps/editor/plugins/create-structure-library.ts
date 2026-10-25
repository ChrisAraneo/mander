import { noop } from 'lodash-es';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { pipe } from 'remeda';
import type { Plugin } from 'vite';
import { createStructurePaths } from './create-structure-paths.ts';
import { handleStructureRequest } from './internal/handle-structure-request.ts';
import { writeResponse } from './internal/write-response.ts';
import type { StructurePaths } from './types/structure-paths.ts';

const STRUCTURE_ENDPOINT = '/api/structures';

const SERVER_ERROR_STATUS = 500;

const writeStructureResponse = (
  paths: StructurePaths,
  request: IncomingMessage,
  response: ServerResponse,
): Promise<ServerResponse> =>
  handleStructureRequest(paths, request).then(
    (answer) => writeResponse(response, answer),
    (error: unknown) =>
      writeResponse(response, {
        status: SERVER_ERROR_STATUS,
        body: { message: String(error) },
      }),
  );

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
