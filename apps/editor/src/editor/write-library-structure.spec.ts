import { size, tap } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createSketch } from './create-sketch';
import { formatStructure } from './format-structure';
import type { FetchResponse } from './types/fetch-response';
import { useLibrary } from './use-library';
import { writeLibraryStructure } from './write-library-structure';

const createFetch =
  (requests: unknown[][], answers: Response[]): FetchResponse =>
  (...request) =>
    tap(Promise.resolve(answers[size(requests)]), () => requests.push(request));

const createAnswer = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status });

describe('writeLibraryStructure', () => {
  it('should say what it wrote and read the library again when a new structure is saved', async () => {
    const library = useLibrary();
    const requests: unknown[][] = [];

    await writeLibraryStructure(
      library,
      'NORMAL_002',
      createSketch('normal'),
      createFetch(requests, [
        createAnswer({ name: 'NORMAL_002', pool: 'normal', isCreated: true }),
        createAnswer([]),
      ]),
    );

    expect(requests).toEqual([
      [
        '/api/structures',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: 'NORMAL_002',
            text: formatStructure(createSketch('normal')),
          }),
        },
      ],
      ['/api/structures'],
    ]);
    expect(library.status.value).toBe('Wrote NORMAL_002 in normal.ts');
    expect(library.isReady.value).toBe(true);
  });

  it('should say it updated the structure when the pool already had it', async () => {
    const library = useLibrary();

    await writeLibraryStructure(
      library,
      'HARD_001',
      createSketch('hard'),
      createFetch(
        [],
        [
          createAnswer({ name: 'HARD_001', pool: 'hard', isCreated: false }),
          createAnswer([]),
        ],
      ),
    );

    expect(library.status.value).toBe('Updated HARD_001 in hard.ts');
  });

  it('should say nothing was saved and leave the library alone when the server turns it away', async () => {
    const library = useLibrary();
    const requests: unknown[][] = [];

    await writeLibraryStructure(
      library,
      'BAD',
      createSketch('normal'),
      createFetch(requests, [
        createAnswer({ message: 'the grid is not a structure literal' }, 400),
      ]),
    );

    expect(requests).toHaveLength(1);
    expect(library.status.value).toBe(
      'Nothing saved — the grid is not a structure literal',
    );
  });
});
