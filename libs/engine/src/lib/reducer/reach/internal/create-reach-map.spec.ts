import { type Tile, TILE_AIR } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createReachMap } from './create-reach-map';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
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

const LEVEL = createLevel(['...', '...']);

describe('createReachMap', () => {
  it('should mark exactly the reached cells row by row when some cells of the level were reached', () => {
    const cells = new Set([1, 5]);

    const reachMap = createReachMap(LEVEL, cells);

    expect(reachMap).toEqual([
      [false, true, false],
      [false, false, true],
    ]);
  });

  it('should mark no cell when nothing in the level was reached', () => {
    const cells = new Set<number>();

    const reachMap = createReachMap(LEVEL, cells);

    expect(reachMap).toEqual([
      [false, false, false],
      [false, false, false],
    ]);
  });
});
