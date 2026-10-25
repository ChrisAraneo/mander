import { assign, map } from 'lodash-es';
import { rm } from 'node:fs/promises';
import type { IncomingMessage } from 'node:http';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from '../create-structure-paths.ts';
import { createLibraryRoot } from '../test/create-library-root.ts';
import { handleStructureRequest } from './handle-structure-request.ts';

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

const createRequest = (method: string, chunks: string[]): IncomingMessage =>
  assign(Readable.from(map(chunks, (chunk) => Buffer.from(chunk))), {
    method,
  }) as unknown as IncomingMessage;

const createRoot = (): Promise<string> =>
  createLibraryRoot({
    'normal.ts': `export const NORMAL_001: Structure = ${TEXT};\n`,
    'hard.ts': '',
    'vertical.ts': '',
    'library.ts': '',
  });

describe('handleStructureRequest', () => {
  it('should answer with the whole library when it is asked for it', async () => {
    const root = await createRoot();

    const answer = await handleStructureRequest(
      createStructurePaths(root),
      createRequest('GET', []),
    );

    expect(answer).toEqual({
      status: 200,
      body: [{ name: 'NORMAL_001', pool: 'normal', text: TEXT }],
    });

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should save the posted structure when the body names it and holds its grid', async () => {
    const root = await createRoot();

    const answer = await handleStructureRequest(
      createStructurePaths(root),
      createRequest('POST', [
        JSON.stringify({ name: 'NORMAL_001', text: TEXT }),
      ]),
    );

    expect(answer).toEqual({
      status: 200,
      body: { name: 'NORMAL_001', pool: 'normal', isCreated: false },
    });

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should turn the post away when the body is json without a structure name', async () => {
    const answer = await handleStructureRequest(
      createStructurePaths('/nowhere/apps/editor'),
      createRequest('POST', ['null']),
    );

    expect(answer.status).toBe(400);
  });

  it('should fail when the posted body is not json', async () => {
    await expect(
      handleStructureRequest(
        createStructurePaths('/nowhere/apps/editor'),
        createRequest('POST', ['not json']),
      ),
    ).rejects.toThrow(SyntaxError);
  });

  it('should refuse the request when it is neither a read nor a post', async () => {
    const answer = await handleStructureRequest(
      createStructurePaths('/nowhere/apps/editor'),
      createRequest('PUT', []),
    );

    expect(answer).toEqual({
      status: 405,
      body: { message: 'GET or POST only' },
    });
  });
});
