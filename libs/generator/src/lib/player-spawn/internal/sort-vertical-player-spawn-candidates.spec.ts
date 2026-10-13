import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { sortVerticalPlayerSpawnCandidates } from './sort-vertical-player-spawn-candidates';

const LEVEL: Tile[][] = [times(5, () => TILE_AIR)];

describe('sortVerticalPlayerSpawnCandidates', () => {
  it('should put the lowest candidate first when the candidates are on different rows', () => {
    expect(
      sortVerticalPlayerSpawnCandidates(LEVEL, [
        { row: 2, column: 2 },
        { row: 9, column: 0 },
        { row: 5, column: 2 },
      ]),
    ).toEqual([
      { row: 9, column: 0 },
      { row: 5, column: 2 },
      { row: 2, column: 2 },
    ]);
  });

  it('should put the candidate nearest the middle column first when two candidates share the lowest row', () => {
    expect(
      sortVerticalPlayerSpawnCandidates(LEVEL, [
        { row: 9, column: 0 },
        { row: 9, column: 3 },
      ]),
    ).toEqual([
      { row: 9, column: 3 },
      { row: 9, column: 0 },
    ]);
  });

  it('should give nothing back when there are no candidates', () => {
    expect(sortVerticalPlayerSpawnCandidates(LEVEL, [])).toEqual([]);
  });
});
