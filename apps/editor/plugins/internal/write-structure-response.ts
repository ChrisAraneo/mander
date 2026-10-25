import type { IncomingMessage, ServerResponse } from 'node:http';
import type { StructurePaths } from '../types/structure-paths.ts';
import { handleStructureRequest } from './handle-structure-request.ts';
import { writeResponse } from './write-response.ts';

const SERVER_ERROR_STATUS = 500;

export const writeStructureResponse = (
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
