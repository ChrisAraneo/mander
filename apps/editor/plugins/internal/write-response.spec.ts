import { assign, tap } from 'lodash-es';
import type { ServerResponse } from 'node:http';
import { describe, expect, it } from 'vitest';

import { writeResponse } from './write-response.ts';

interface FakeResponse {
  statusCode: number;
}

const createResponse = (calls: unknown[][]): ServerResponse =>
  tap<FakeResponse>({ statusCode: 200 }, (response) =>
    assign(response, {
      setHeader: (name: string, value: string): FakeResponse =>
        tap(response, () => calls.push(['setHeader', name, value])),
      end: (body: string): FakeResponse =>
        tap(response, () => calls.push(['end', body])),
    }),
  ) as unknown as ServerResponse;

describe('writeResponse', () => {
  it('should send the status and the body as json when it answers', () => {
    const calls: unknown[][] = [];
    const response = createResponse(calls);

    const written = writeResponse(response, {
      status: 400,
      body: { message: 'no' },
    });

    expect(written).toBe(response);
    expect(response.statusCode).toBe(400);
    expect(calls).toEqual([
      ['setHeader', 'content-type', 'application/json'],
      ['end', '{"message":"no"}'],
    ]);
  });
});
