import { TILE_AIR, TILE_DIRT, TILE_SPIKE, type Tile } from '@mander/model';
import { chunk, map, range, sortBy, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../get-level-type';
import { shuffleGemCandidates } from './shuffle-gem-candidates';

const WIDTH = 12;

const LEVEL: Tile[][] = [
  times(WIDTH, () => TILE_AIR),
  times(WIDTH, () => TILE_DIRT),
];

const SPIKED_LEVEL: Tile[][] = [
  times(WIDTH, (column) => (column === 0 ? TILE_SPIKE : TILE_AIR)),
  times(WIDTH, () => TILE_DIRT),
];

const SLOTS = chunk(
  map(range(WIDTH), (column) => ({ row: 1, column })),
  4,
);

const shuffleIn = (tiles: Tile[][], levelType: LevelType) =>
  shuffleGemCandidates({ tiles, levelType, slots: SLOTS }).slots;

describe('shuffleGemCandidates', () => {
  it('should keep every candidate in its slot when it shuffles a horizontal level', () => {
    expect(
      map(shuffleIn(LEVEL, 'HORIZONTAL'), (slot) => sortBy(slot, 'column')),
    ).toEqual(SLOTS);
  });

  it('should keep every candidate in its slot when it shuffles a vertical level', () => {
    expect(
      map(shuffleIn(LEVEL, 'VERTICAL'), (slot) => sortBy(slot, 'column')),
    ).toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles a horizontal level', () => {
    expect(shuffleIn(LEVEL, 'HORIZONTAL')).not.toEqual(SLOTS);
  });

  it('should mix the candidates up when it shuffles a vertical level', () => {
    expect(shuffleIn(LEVEL, 'VERTICAL')).not.toEqual(SLOTS);
  });

  it('should shuffle the candidates the same way when it gets the same grid', () => {
    expect(shuffleIn(LEVEL, 'HORIZONTAL')).toEqual(
      shuffleIn(LEVEL, 'HORIZONTAL'),
    );
  });

  it('should shuffle the candidates another way when the grid is different', () => {
    expect(shuffleIn(LEVEL, 'HORIZONTAL')).not.toEqual(
      shuffleIn(SPIKED_LEVEL, 'HORIZONTAL'),
    );
  });

  it('should give no slots when it gets no slots', () => {
    expect(
      shuffleGemCandidates({ tiles: LEVEL, levelType: 'VERTICAL', slots: [] })
        .slots,
    ).toEqual([]);
  });

  it('should keep the grid and level type the same when it shuffles', () => {
    const shuffled = shuffleGemCandidates({
      tiles: LEVEL,
      levelType: 'VERTICAL',
      slots: [],
    });

    expect(shuffled.tiles).toBe(LEVEL);
    expect(shuffled.levelType).toBe('VERTICAL');
  });
});
