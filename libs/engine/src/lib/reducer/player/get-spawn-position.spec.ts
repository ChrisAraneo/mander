import {
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { PLAYER_HEIGHT } from './consts';
import { getSpawnPosition } from './get-spawn-position';

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
  shooterEnemyChance: 0,
});

const LEVEL_WITH_SPAWN = createLevel([
  '.....',
  '.....',
  '.....',
  '..S..',
  '#####',
]);

const LEVEL_WITHOUT_SPAWN = createLevel(['.....', '.....', '#####']);

describe('getSpawnPosition', () => {
  it('should stand the player on the spawn tile when the level has one', () => {
    const position = getSpawnPosition(LEVEL_WITH_SPAWN);

    expect(position).toEqual({
      x: 2 * TILE_SIZE + 5,
      y: 4 * TILE_SIZE - PLAYER_HEIGHT - TILE_SIZE,
    });
    expect(position).toEqual({ x: 69, y: 48 });
  });

  it('should put the player in the top left corner when the level has no spawn tile', () => {
    const position = getSpawnPosition(LEVEL_WITHOUT_SPAWN);

    expect(position).toEqual({ x: 0, y: 0 });
  });
});
