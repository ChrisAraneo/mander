import { map } from 'lodash-es';
import type { IncomingMessage } from 'node:http';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { readRequestBody } from './read-request-body.ts';

const createRequest = (chunks: string[]): IncomingMessage =>
  Readable.from(
    map(chunks, (chunk) => Buffer.from(chunk, 'utf8')),
  ) as unknown as IncomingMessage;

describe('readRequestBody', () => {
  it('should give the whole body as text when it arrives in several chunks', async () => {
    expect(await readRequestBody(createRequest(['{"name":', '"Łódź"}']))).toBe(
      '{"name":"Łódź"}',
    );
  });

  it('should give an empty text when the body is empty', async () => {
    expect(await readRequestBody(createRequest([]))).toBe('');
  });
});
