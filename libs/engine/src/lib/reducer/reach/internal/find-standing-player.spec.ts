import { type Tile, TILE_AIR, TILE_DIRT } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createStandingPlayer } from './create-standing-player';
import { findStandingPlayer } from './find-standing-player';

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

const LEVEL = createLevel(['.#...', '.....', '.#...', '.....']);

describe('findStandingPlayer', () => {
  it('should stand the player on the first ground below the starting row when the column has ground further down', () => {
    const player = findStandingPlayer(LEVEL, 1, 1);

    expect(player).toEqual(createStandingPlayer(37, 16));
  });

  it('should stand the player on the starting row when the ground is on that row', () => {
    const player = findStandingPlayer(LEVEL, 1, 2);

    expect(player).toEqual(createStandingPlayer(37, 16));
  });

  it('should give no player when the column has no ground from the starting row down', () => {
    const player = findStandingPlayer(LEVEL, 1, 3);

    expect(player).toBeUndefined();
  });

  it('should give no player when the column has no ground at all', () => {
    const player = findStandingPlayer(LEVEL, 3, 0);

    expect(player).toBeUndefined();
  });
});
