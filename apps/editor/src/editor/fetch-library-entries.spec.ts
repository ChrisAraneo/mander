import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { constant } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { fetchLibraryEntries } from './fetch-library-entries';
import { useLibrary } from './use-library';

const TEXT = '[\n  [\n    [__, DR],\n  ],\n  [],\n]';

describe('fetchLibraryEntries', () => {
  it('should hold the entries and be ready when the library arrives', async () => {
    const library = useLibrary();

    await fetchLibraryEntries(
      library,
      constant(
        Promise.resolve(
          new Response(
            JSON.stringify([{ name: 'HARD_001', pool: 'hard', text: TEXT }]),
          ),
        ),
      ),
    );

    expect(library.entries.value).toEqual([
      {
        name: 'HARD_001',
        pool: 'hard',
        sketch: { tiles: [[TILE_AIR, TILE_DIRT]], backTiles: [] },
      },
    ]);
    expect(library.isReady.value).toBe(true);
    expect(library.status.value).toBe('');
  });

  it('should say the library is out of reach and not be ready when the request fails', async () => {
    const library = useLibrary();

    await fetchLibraryEntries(
      library,
      constant(Promise.reject(new Error('offline'))),
    );

    expect(library.entries.value).toEqual([]);
    expect(library.isReady.value).toBe(false);
    expect(library.status.value).toBe('The library is out of reach — offline');
  });
});
