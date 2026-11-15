import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../state/types/game-level';
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

const IN_ONE_COLUMN_X = 32;

const STRADDLING_TWO_COLUMNS_X = 50;

const STANDING_Y = 16;

const ACROSS_THREE_ROWS_Y = 20;

const LEVEL = createLevel(['.....', '.....', '.....', '#####']);

describe('computeBodyCells', () => {
  it('should give the cells of one column when the player fits inside it', () => {
    const player = createStandingPlayer(IN_ONE_COLUMN_X, STANDING_Y);

    const cells = computeBodyCells(LEVEL, player);

    expect(cells).toEqual([1, 6]);
  });

  it('should give the cells of both columns row by row when the player straddles two columns', () => {
    const player = createStandingPlayer(STRADDLING_TWO_COLUMNS_X, STANDING_Y);

    const cells = computeBodyCells(LEVEL, player);

    expect(cells).toEqual([1, 2, 6, 7]);
  });

  it('should give the cells of three rows when the player sits across them', () => {
    const player = createStandingPlayer(IN_ONE_COLUMN_X, ACROSS_THREE_ROWS_Y);

    const cells = computeBodyCells(LEVEL, player);

    expect(cells).toEqual([1, 6, 11]);
  });
});
