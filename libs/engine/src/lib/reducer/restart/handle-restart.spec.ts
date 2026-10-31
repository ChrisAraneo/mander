import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import { handleRestart } from './handle-restart';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = ['.....', '.S...', '#####'];

const createLevel = (): GameLevel => ({
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

describe('handleRestart', () => {
  it('should start a fresh run on the first level with nothing carried when the player restarts', () => {
    const level = createLevel();

    const restarted = handleRestart(level);

    expect(restarted).toEqual(createInitialState(createLevel(), 0, []));
  });

  it('should play the level it was given when the player restarts', () => {
    const level = createLevel();

    const restarted = handleRestart(level);

    expect(restarted.level).toBe(level);
    expect(restarted.levelIndex).toBe(0);
    expect(restarted.inventory).toEqual([]);
    expect(restarted.score).toBe(0);
  });

  it('should leave the given level unchanged when the player restarts', () => {
    const level = createLevel();

    handleRestart(level);

    expect(level).toEqual(createLevel());
  });
});
