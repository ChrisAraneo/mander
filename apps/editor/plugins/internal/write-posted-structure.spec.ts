import { assign, map } from 'lodash-es';
import { readFile, rm } from 'node:fs/promises';
import type { IncomingMessage } from 'node:http';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { createStructurePaths } from '../create-structure-paths.ts';
import { createLibraryRoot } from '../test/create-library-root.ts';
import { writePostedStructure } from './write-posted-structure.ts';

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

const BODY = String.raw`{"name":"NORMAL_001","text":"[\n  [\n    [__, DR],\n  ],\n  [],\n]"}`;

const createRequest = (chunks: string[]): IncomingMessage =>
  assign(Readable.from(map(chunks, (chunk) => Buffer.from(chunk))), {
    method: 'POST',
  }) as unknown as IncomingMessage;

describe('writePostedStructure', () => {
  it('should save the structure and answer with what it saved when the body names it and holds its grid', async () => {
    const root = await createLibraryRoot({
      'normal.ts': "import { DR, __ } from './consts';\n",
      'hard.ts': '',
      'vertical.ts': '',
      'library.ts': '',
    });

    const answer = await writePostedStructure(
      createStructurePaths(root),
      createRequest([BODY]),
    );

    expect(answer).toEqual({
      status: 200,
      body: { name: 'NORMAL_001', pool: 'normal', isCreated: true },
    });
    expect(
      await readFile(
        resolve(root, '../../libs/structures/src/lib/normal.ts'),
        'utf8',
      ),
    ).toContain(`export const NORMAL_001: Structure = ${TEXT};`);

    await rm(resolve(root, '../..'), { recursive: true, force: true });
  });

  it('should turn the post away when the body is empty json', async () => {
    const answer = await writePostedStructure(
      createStructurePaths('/nowhere/apps/editor'),
      createRequest(['{}']),
    );

    expect(answer.status).toBe(400);
  });

  it('should fail when the body is not json', async () => {
    await expect(
      writePostedStructure(
        createStructurePaths('/nowhere/apps/editor'),
        createRequest(['not json']),
      ),
    ).rejects.toThrow(SyntaxError);
  });
});
