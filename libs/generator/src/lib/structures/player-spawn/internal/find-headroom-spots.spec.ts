import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findHeadroomSpots } from './find-headroom-spots';

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) => (cell === '#' ? TILE_DIRT : TILE_AIR)),
  );

describe('findHeadroomSpots', () => {
  it('should give the spots with room for the player to stand up when there are some', () => {
    expect(
      findHeadroomSpots(
        createGrid(['...', '...', '...', '...', '###', '...', '...', '###']),
      ),
    ).toEqual([
      { row: 4, column: 0 },
      { row: 4, column: 1 },
      { row: 4, column: 2 },
    ]);
  });

  it('should leave out the spots just tall enough for the spawn when some have room to stand up', () => {
    expect(
      findHeadroomSpots(createGrid(['...', '...', '.##', '...', '#..'])),
    ).toEqual([{ row: 4, column: 0 }]);
  });

  it('should give the spots just tall enough for the spawn when none have more room', () => {
    expect(findHeadroomSpots(createGrid(['...', '...', '#.#']))).toEqual([
      { row: 2, column: 0 },
      { row: 2, column: 2 },
    ]);
  });

  it('should give no spots when there is nowhere to stand', () => {
    expect(findHeadroomSpots(createGrid(['...', '...', '...']))).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(findHeadroomSpots([])).toEqual([]);
  });
});
