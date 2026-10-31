import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeBodyCells } from './compute-body-cells';
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
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '.....', '#####']);

describe('computeBodyCells', () => {
  it('should give the cells of one column when the player fits inside it', () => {
    const player = createStandingPlayer(32, 16);

    const cells = computeBodyCells(LEVEL, player);

    expect(cells).toEqual([1, 6]);
  });

  it('should give the cells of both columns row by row when the player straddles two columns', () => {
    const player = createStandingPlayer(50, 16);

    const cells = computeBodyCells(LEVEL, player);

    expect(cells).toEqual([1, 2, 6, 7]);
  });

  it('should give the cells of three rows when the player sits across them', () => {
    const player = createStandingPlayer(32, 20);

    const cells = computeBodyCells(LEVEL, player);

    expect(cells).toEqual([1, 6, 11]);
  });
});
