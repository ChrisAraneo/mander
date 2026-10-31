import { type Player, type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { computeFootingCells } from './compute-footing-cells';
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

const createAirbornePlayer = (left: number, top: number): Player => ({
  ...createStandingPlayer(left, top),
  statuses: { ...createStandingPlayer(left, top).statuses, isGrounded: false },
});

const LEVEL = createLevel(['.....', '.....', '###.#']);

describe('computeFootingCells', () => {
  it('should give the solid cells under the feet when the player stands on two tiles', () => {
    const player = createStandingPlayer(50, 16);

    const cells = computeFootingCells(LEVEL, player);

    expect(cells).toEqual([11, 12]);
  });

  it('should leave out the gap when the player stands at the edge of a hole', () => {
    const player = createStandingPlayer(80, 16);

    const cells = computeFootingCells(LEVEL, player);

    expect(cells).toEqual([12]);
  });

  it('should give no cells when the player is in the air', () => {
    const player = createAirbornePlayer(50, 16);

    const cells = computeFootingCells(LEVEL, player);

    expect(cells).toEqual([]);
  });
});
