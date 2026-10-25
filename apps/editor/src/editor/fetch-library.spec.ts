import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { fetchLibrary } from './fetch-library';
import type { FetchResponse } from './types/fetch-response';

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

const createFetch =
  (requests: unknown[][], body: unknown, status = 200): FetchResponse =>
  (...request) =>
    tap(Promise.resolve(new Response(JSON.stringify(body), { status })), () =>
      requests.push(request),
    );

describe('fetchLibrary', () => {
  it('should read every entry into a sketch when the server answers with the library', async () => {
    const requests: unknown[][] = [];

    const entries = await fetchLibrary(
      createFetch(requests, [
        { name: 'NORMAL_001', pool: 'normal', text: TEXT },
      ]),
    );

    expect(requests).toEqual([['/api/structures']]);
    expect(entries).toEqual([
      {
        name: 'NORMAL_001',
        pool: 'normal',
        sketch: { tiles: [[TILE_AIR, TILE_DIRT]], backTiles: [] },
      },
    ]);
  });

  it('should give no entries when the library is empty', async () => {
    expect(await fetchLibrary(createFetch([], []))).toEqual([]);
  });

  it('should fail with the message of the server when it refuses', async () => {
    await expect(
      fetchLibrary(createFetch([], { message: 'GET or POST only' }, 405)),
    ).rejects.toThrow('GET or POST only');
  });
});
