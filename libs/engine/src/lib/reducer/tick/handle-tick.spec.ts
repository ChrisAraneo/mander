import {
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_GEM,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import type { GameStatus } from '../../types/game-status';
import { GEM_SCORE } from '../score/consts';
import { handleTick } from './handle-tick';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  c: TILE_CHEST,
  g: TILE_GEM,
  k: TILE_KEY,
  p: TILE_PORTAL,
  s: TILE_SPAWN,
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

const createStateFor = (rows: string[]): GameState =>
  createInitialState(createLevel(rows), 0, []);

const OPEN_ROWS = [
  '........',
  '........',
  '........',
  's.......',
  '........',
  '########',
];

const createStateWith = (status: GameStatus): GameState => ({
  ...createStateFor(OPEN_ROWS),
  status,
});

const createGemState = (): GameState => ({
  ...createStateFor([
    '........',
    '........',
    'g.......',
    's.......',
    '........',
    '########',
  ]),
  score: 1000,
});

describe('handleTick', () => {
  it('should leave the game as it is when the player has reached a chest', () => {
    const state = createStateWith('CHEST');

    const next = handleTick(state, 0.02);

    expect(next).toBe(state);
  });

  it('should leave the game as it is when the level is complete', () => {
    const state = createStateWith('COMPLETE');

    const next = handleTick(state, 0.02);

    expect(next).toBe(state);
  });

  it('should leave the game as it is when the game is over', () => {
    const state = createStateWith('GAME_OVER');

    const next = handleTick(state, 0.02);

    expect(next).toBe(state);
  });

  it('should move the clock on and let the player fall when the game is being played', () => {
    const state = { ...createStateWith('PLAYING'), time: 1.5 };

    const next = handleTick(state, 0.02);

    expect(next.time).toBeCloseTo(1.52, 6);
    expect(next.player.position.x).toBe(5);
    expect(next.player.position.y).toBeCloseTo(48.72, 6);
    expect(next.player.velocity.y.current).toBeCloseTo(36, 6);
  });

  it('should pick up the gem and add its score when the player reaches a gem', () => {
    const state = createGemState();

    const next = handleTick(state, 0.02);

    expect(state.gems).toEqual([{ x: 0, y: 2 }]);
    expect(next.gems).toEqual([]);
    expect(next.score).toBe(1000 + GEM_SCORE);
  });

  it('should give the player the key when the player stands by the key', () => {
    const state = createStateFor([
      '........',
      '........',
      'k.......',
      's.......',
      '........',
      '########',
    ]);

    const next = handleTick(state, 0.02);

    expect(next.hasKey).toBe(true);
  });

  it('should say the player is near the chest when the player stands by the closed chest', () => {
    const state = createStateFor([
      '........',
      '........',
      '........',
      'sc......',
      '........',
      '########',
    ]);

    const next = handleTick(state, 0.02);

    expect(next.isNearChest).toBe(true);
  });

  it('should say the player is near the portal when the player stands by the portal', () => {
    const state = createStateFor([
      '........',
      '........',
      '........',
      'sp......',
      '........',
      '########',
    ]);

    const next = handleTick(state, 0.02);

    expect(next.isNearPortal).toBe(true);
  });

  it('should leave the given game unchanged when the game moves on', () => {
    const state = createGemState();

    handleTick(state, 0.02);

    expect(state).toEqual(createGemState());
  });
});
