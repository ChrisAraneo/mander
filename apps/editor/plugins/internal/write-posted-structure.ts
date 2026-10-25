import type { IncomingMessage } from 'node:http';
import type { StructurePaths } from '../types/structure-paths.ts';
import { parseJson } from './parse-json.ts';
import { parseStructureRequest } from './parse-structure-request.ts';
import { readRequestBody } from './read-request-body.ts';
import type { StructureResponse } from './types/structure-response.ts';
import { writeRequestedStructure } from './write-requested-structure.ts';

export const writePostedStructure = (
  paths: StructurePaths,
  request: IncomingMessage,
): Promise<StructureResponse> =>
  readRequestBody(request)
    .then(parseJson)
    .then(parseStructureRequest)
    .then((structure) => writeRequestedStructure(paths, structure));
