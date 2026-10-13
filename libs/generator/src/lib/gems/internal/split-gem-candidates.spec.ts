import { TILE_AIR, type Tile } from '@mander/model';
import { createRandom } from '@mander/utils';
import { times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { splitGemCandidates } from './split-gem-candidates';

const RANDOM = createRandom('SEED');

const createLevel = (width: number, height: number): Tile[][] =>
  times(height, () => times(width, () => TILE_AIR));

describe('splitGemCandidates', () => {
  it('should group the candidates by their columns in a horizontal level when they stand apart', () => {
    expect(
      splitGemCandidates({
        tiles: createLevel(8, 10),
        levelType: 'HORIZONTAL',
        candidates: [
          { row: 9, column: 1 },
          { row: 2, column: 6 },
        ],
        random: RANDOM,
      }).slots,
    ).toEqual([[{ row: 9, column: 1 }], [{ row: 2, column: 6 }]]);
  });

  it('should group the candidates by their rows in a vertical level when they stand apart', () => {
    expect(
      splitGemCandidates({
        tiles: createLevel(8, 10),
        levelType: 'VERTICAL',
        candidates: [
          { row: 1, column: 6 },
          { row: 6, column: 1 },
        ],
        random: RANDOM,
      }).slots,
    ).toEqual([[{ row: 1, column: 6 }], [{ row: 6, column: 1 }], []]);
  });

  it('should give no slots when the grid is empty', () => {
    expect(
      splitGemCandidates({
        tiles: [],
        levelType: 'HORIZONTAL',
        candidates: [],
        random: RANDOM,
      }).slots,
    ).toEqual([]);
  });

  it('should keep the grid the same when it groups', () => {
    const tiles = createLevel(3, 3);

    expect(
      splitGemCandidates({
        tiles,
        levelType: 'HORIZONTAL',
        candidates: [],
        random: RANDOM,
      }).tiles,
    ).toBe(tiles);
  });

  it('should pass the level type on when it groups', () => {
    expect(
      splitGemCandidates({
        tiles: [],
        levelType: 'VERTICAL',
        candidates: [],
        random: RANDOM,
      }).levelType,
    ).toBe('VERTICAL');
  });

  it('should pass the generator on when it groups', () => {
    expect(
      splitGemCandidates({
        tiles: [],
        levelType: 'VERTICAL',
        candidates: [],
        random: RANDOM,
      }).random,
    ).toBe(RANDOM);
  });
});
