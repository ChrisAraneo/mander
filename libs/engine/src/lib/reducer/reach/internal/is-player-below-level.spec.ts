import { type Tile, TILE_AIR, TILE_DIRT, TILE_SIZE } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createStandingPlayer } from './create-standing-player';
import { isPlayerBelowLevel } from './is-player-below-level';

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

const LEVEL = createLevel(['...', '...', '###']);

describe('isPlayerBelowLevel', () => {
  it('should be below the level when the player is lower than the bottom edge', () => {
    const player = createStandingPlayer(0, 3 * TILE_SIZE + 1);

    const isBelow = isPlayerBelowLevel(LEVEL, player);

    expect(isBelow).toBe(true);
  });

  it('should not be below the level when the player is exactly on the bottom edge', () => {
    const player = createStandingPlayer(0, 3 * TILE_SIZE);

    const isBelow = isPlayerBelowLevel(LEVEL, player);

    expect(isBelow).toBe(false);
  });
});
