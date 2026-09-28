import { TILE_AIR, type Tile } from '@mander/model';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { groupGemCandidates } from './group-gem-candidates';

const createLevel = (width: number, height: number): Tile[][] =>
  times(height, () => times(width, () => TILE_AIR));

describe('groupGemCandidates', () => {
  it('should group the candidates by their columns in a horizontal level when they stand apart', () => {
    expect(
      groupGemCandidates({
        tiles: createLevel(8, 10),
        levelType: 'HORIZONTAL',
        candidates: [
          { row: 9, column: 1 },
          { row: 2, column: 6 },
        ],
      }).slots,
    ).toEqual([[{ row: 9, column: 1 }], [{ row: 2, column: 6 }]]);
  });

  it('should group the candidates by their rows in a vertical level when they stand apart', () => {
    expect(
      groupGemCandidates({
        tiles: createLevel(8, 10),
        levelType: 'VERTICAL',
        candidates: [
          { row: 1, column: 6 },
          { row: 6, column: 1 },
        ],
      }).slots,
    ).toEqual([[{ row: 1, column: 6 }], [{ row: 6, column: 1 }], []]);
  });

  it('should give no slots when the grid is empty', () => {
    expect(
      groupGemCandidates({ tiles: [], levelType: 'HORIZONTAL', candidates: [] })
        .slots,
    ).toEqual([]);
  });

  it('should keep the grid the same when it groups', () => {
    const tiles = createLevel(3, 3);

    expect(
      groupGemCandidates({ tiles, levelType: 'HORIZONTAL', candidates: [] })
        .tiles,
    ).toBe(tiles);
  });

  it('should pass the level type on when it groups', () => {
    expect(
      groupGemCandidates({ tiles: [], levelType: 'VERTICAL', candidates: [] })
        .levelType,
    ).toBe('VERTICAL');
  });
});
