import type { IncomingMessage } from 'node:http';
import { match } from 'ts-pattern';
import type { StructurePaths } from '../types/structure-paths.ts';
import { readLibraryResponse } from './read-library-response.ts';
import type { StructureResponse } from './types/structure-response.ts';
import { writePostedStructure } from './write-posted-structure.ts';

const METHOD_RESPONSE: StructureResponse = {
  status: 405,
  body: { message: 'GET or POST only' },
};

export const handleStructureRequest = (
  paths: StructurePaths,
  request: IncomingMessage,
): Promise<StructureResponse> =>
  match(request.method)
    .with('GET', () => readLibraryResponse(paths))
    .with('POST', () => writePostedStructure(paths, request))
    .otherwise(() => Promise.resolve(METHOD_RESPONSE));
