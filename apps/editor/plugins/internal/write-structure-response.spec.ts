import { assign, map, tap } from 'lodash-es';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from '../create-structure-paths.ts';
import { writeStructureResponse } from './write-structure-response.ts';

interface FakeResponse {
  statusCode: number;
}

const createRequest = (method: string, chunks: string[]): IncomingMessage =>
  assign(Readable.from(map(chunks, (chunk) => Buffer.from(chunk))), {
    method,
  }) as unknown as IncomingMessage;

const createResponse = (calls: unknown[][]): ServerResponse =>
  tap<FakeResponse>({ statusCode: 200 }, (response) =>
    assign(response, {
      setHeader: (name: string, value: string): FakeResponse =>
        tap(response, () => calls.push(['setHeader', name, value])),
      end: (body: string): FakeResponse =>
        tap(response, () => calls.push(['end', body])),
    }),
  ) as unknown as ServerResponse;

const PATHS = createStructurePaths('/nowhere/apps/editor');

describe('writeStructureResponse', () => {
  it('should send the answer to the request when the request is handled', async () => {
    const calls: unknown[][] = [];
    const response = createResponse(calls);

    const written = await writeStructureResponse(
      PATHS,
      createRequest('PUT', []),
      response,
    );

    expect(written).toBe(response);
    expect(response.statusCode).toBe(405);
    expect(calls).toEqual([
      ['setHeader', 'content-type', 'application/json'],
      ['end', '{"message":"GET or POST only"}'],
    ]);
  });

  it('should send a server error with the message when handling the request fails', async () => {
    const calls: unknown[][] = [];
    const response = createResponse(calls);

    await writeStructureResponse(
      PATHS,
      createRequest('POST', ['not json']),
      response,
    );

    expect(response.statusCode).toBe(500);
    expect(calls[1]).toEqual([
      'end',
      `{"message":"SyntaxError: Unexpected token 'o', \\"not json\\" is not valid JSON"}`,
    ]);
  });
});
