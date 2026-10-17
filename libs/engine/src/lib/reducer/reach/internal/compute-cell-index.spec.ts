import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeCellIndex } from './compute-cell-index';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '.....', '#####']);

describe('computeCellIndex', () => {
  it('should count the cells row by row across the level when it is given a row and a column', () => {
    const index = computeCellIndex(LEVEL, 2, 3);

    expect(index).toBe(13);
  });

  it('should give zero when the cell is the top left corner of the level', () => {
    const index = computeCellIndex(LEVEL, 0, 0);

    expect(index).toBe(0);
  });

  it('should give the last index when the cell is the bottom right corner of the level', () => {
    const index = computeCellIndex(LEVEL, 3, 4);

    expect(index).toBe(19);
  });
});
