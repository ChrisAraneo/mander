import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../../types/game-level';
import { createStandingPlayer } from './create-standing-player';
import { findEntryPlayer } from './find-entry-player';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
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

const WITH_SPAWN = createLevel(['..#..', '..S..', '.....', '..#..', '#####']);

const WITHOUT_SPAWN = createLevel(['.....', '.....', '#....', '#####']);

const WITHOUT_ENTRY_GROUND = createLevel(['.....', '.####']);

describe('findEntryPlayer', () => {
  it('should stand the player on the first ground at or below the spawn when the level has a spawn', () => {
    const player = findEntryPlayer(WITH_SPAWN);

    expect(player).toEqual(createStandingPlayer(69, 48));
  });

  it('should stand the player on the first ground of the leftmost column when the level has no spawn', () => {
    const player = findEntryPlayer(WITHOUT_SPAWN);

    expect(player).toEqual(createStandingPlayer(5, 16));
  });

  it('should give no player when the level has no spawn and no ground in the leftmost column', () => {
    const player = findEntryPlayer(WITHOUT_ENTRY_GROUND);

    expect(player).toBeUndefined();
  });
});
