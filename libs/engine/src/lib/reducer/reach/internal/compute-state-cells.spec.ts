import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
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
});

const LEVEL = createLevel(['.....', '.....', '###.#']);

describe('computeStateCells', () => {
  it('should give the cells of the body followed by the cells under the feet when the player stands on the ground', () => {
    const player = createStandingPlayer(50, 16);

    const cells = computeStateCells(LEVEL, player);

    expect(cells).toEqual([1, 2, 6, 7, 11, 12]);
  });
});
