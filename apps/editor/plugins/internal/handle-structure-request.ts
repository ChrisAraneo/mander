import type { IncomingMessage } from 'node:http';
import { match } from 'ts-pattern';
import { readLibrary } from '../read-library.ts';
import type { StructurePaths } from '../types/structure-paths.ts';
import { parseStructureRequest } from './parse-structure-request.ts';
import { readRequestBody } from './read-request-body.ts';
import type { StructureResponse } from './types/structure-response.ts';
import { writeRequestedStructure } from './write-requested-structure.ts';

const METHOD_RESPONSE: StructureResponse = {
  status: 405,
  body: { message: 'GET or POST only' },
};

const parseJson = (body: string): unknown => JSON.parse(body);

const readLibraryResponse = (
  paths: StructurePaths,
): Promise<StructureResponse> =>
  readLibrary(paths).then((library): StructureResponse => ({
    status: 200,
    body: library,
  }));

const writePostedStructure = (
  paths: StructurePaths,
  request: IncomingMessage,
): Promise<StructureResponse> =>
  readRequestBody(request)
    .then(parseJson)
    .then(parseStructureRequest)
    .then((structure) => writeRequestedStructure(paths, structure));

export const handleStructureRequest = (
  paths: StructurePaths,
  request: IncomingMessage,
): Promise<StructureResponse> =>
  match(request.method)
    .with('GET', () => readLibraryResponse(paths))
    .with('POST', () => writePostedStructure(paths, request))
    .otherwise(() => Promise.resolve(METHOD_RESPONSE));
