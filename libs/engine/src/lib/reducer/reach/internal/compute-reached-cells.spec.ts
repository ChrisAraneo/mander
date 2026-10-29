import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { every, head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeReachedCells } from './compute-reached-cells';
import { computeStateCells } from './compute-state-cells';
import { createStandingPlayer } from './create-standing-player';

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const FLAT_FLOOR = createLevel([
  '........',
  '........',
  '........',
  '########',
]);

describe('computeReachedCells', () => {
  it('should include the cells of the player when the player starts on a flat floor', () => {
    const player = createStandingPlayer(101, 48);

    const cells = computeReachedCells(FLAT_FLOOR, player);

    expect(
      every(computeStateCells(FLAT_FLOOR, player), (cell) => cells.has(cell)),
    ).toBe(true);
  });

  it('should reach both ends of the floor when the player starts in the middle of a flat floor', () => {
    const player = createStandingPlayer(101, 48);

    const cells = computeReachedCells(FLAT_FLOOR, player);

    expect(cells.has(16)).toBe(true);
    expect(cells.has(23)).toBe(true);
  });
});
