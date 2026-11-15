import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../state/types/game-level';
import { computeSpawnPosition } from './compute-spawn-position';
import { PLAYER_HEIGHT, SPAWN_OFFSET_X } from './consts';

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
  freezingEnemyChance: 0,
});

const LEVEL_WITH_SPAWN = createLevel([
  '.....',
  '.....',
  '.....',
  '..S..',
  '#####',
]);

const LEVEL_WITHOUT_SPAWN = createLevel(['.....', '.....', '#####']);

const SPAWN_COLUMN = 2;

const SPAWN_ROW = 3;

const TOP_LEFT = { x: 0, y: 0 };

describe('computeSpawnPosition', () => {
  it('should stand the player on the spawn tile when the level has one', () => {
    const position = computeSpawnPosition(LEVEL_WITH_SPAWN);

    expect(position).toEqual({
      x: SPAWN_COLUMN * TILE_SIZE + SPAWN_OFFSET_X,
      y: (SPAWN_ROW + 1) * TILE_SIZE - PLAYER_HEIGHT - TILE_SIZE,
    });
  });

  it('should put the player in the top left corner when the level has no spawn tile', () => {
    const position = computeSpawnPosition(LEVEL_WITHOUT_SPAWN);

    expect(position).toEqual(TOP_LEFT);
  });

  it('should leave the level it was handed untouched when it looks for the spawn', () => {
    const level = createLevel(['.....', '.....', '.....', '..S..', '#####']);

    computeSpawnPosition(level);

    expect(level).toEqual(
      createLevel(['.....', '.....', '.....', '..S..', '#####']),
    );
  });
});
