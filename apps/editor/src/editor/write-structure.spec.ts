import { tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { FetchResponse } from './types/fetch-response';
import { writeStructure } from './write-structure';

const createFetch =
  (requests: unknown[][], body: unknown, status = 200): FetchResponse =>
  (...request) =>
    tap(Promise.resolve(new Response(JSON.stringify(body), { status })), () =>
      requests.push(request),
    );

describe('writeStructure', () => {
  it('should post the name and the text as json and give back what was saved when the server takes it', async () => {
    const requests: unknown[][] = [];

    const saved = await writeStructure(
      'NORMAL_002',
      '[]',
      createFetch(requests, {
        name: 'NORMAL_002',
        pool: 'normal',
        isCreated: true,
      }),
    );

    expect(requests).toEqual([
      [
        '/api/structures',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"name":"NORMAL_002","text":"[]"}',
        },
      ],
    ]);
    expect(saved).toEqual({
      name: 'NORMAL_002',
      pool: 'normal',
      isCreated: true,
    });
  });

  it('should fail with the message of the server when it turns the structure away', async () => {
    await expect(
      writeStructure(
        'BAD',
        '[]',
        createFetch(
          [],
          { message: 'the grid is not a structure literal' },
          400,
        ),
      ),
    ).rejects.toThrow('the grid is not a structure literal');
  });
});
