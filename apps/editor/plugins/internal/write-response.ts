import { assign } from 'lodash-es';
import type { ServerResponse } from 'node:http';
import { pipe } from 'remeda';
import type { StructureResponse } from './types/structure-response.ts';

export const writeResponse = (
  response: ServerResponse,
  { status, body }: StructureResponse,
): ServerResponse =>
  pipe(
    assign(response, { statusCode: status }),
    (answered) => answered.setHeader('content-type', 'application/json'),
    (answered) => answered.end(JSON.stringify(body)),
  );
