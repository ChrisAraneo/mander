import { TILE_CANNON_TRIPLE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createTripleCannonPatches } from './create-triple-cannon-patches';

describe('createTripleCannonPatches', () => {
  it('should put a triple cannon on every spot when it is given some spots', () => {
    expect(
      createTripleCannonPatches([
        { row: 0, column: 1 },
        { row: 2, column: 3 },
      ]),
    ).toEqual([
      { row: 0, column: 1, tile: TILE_CANNON_TRIPLE },
      { row: 2, column: 3, tile: TILE_CANNON_TRIPLE },
    ]);
  });

  it('should give no edits when it is given no spots', () => {
    expect(createTripleCannonPatches([])).toEqual([]);
  });
});
