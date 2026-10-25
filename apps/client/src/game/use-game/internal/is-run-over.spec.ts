import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isRunOver } from './is-run-over';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
};

const createState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  ...patch,
});

const WORLD = { name: 'ABC', levels: [LEVEL, LEVEL], score: 0 };

describe('isRunOver', () => {
  it('should be over when the player is out of hearts', () => {
    expect(isRunOver(WORLD, createState({ status: 'GAME_OVER' }))).toBe(true);
  });

  it('should be over when the last level is complete', () => {
    expect(
      isRunOver(WORLD, createState({ status: 'COMPLETE', levelIndex: 1 })),
    ).toBe(true);
  });

  it('should go on when a level before the last is complete', () => {
    expect(
      isRunOver(WORLD, createState({ status: 'COMPLETE', levelIndex: 0 })),
    ).toBe(false);
  });

  it('should go on when the level is still being played', () => {
    expect(isRunOver(WORLD, createState({ levelIndex: 1 }))).toBe(false);
  });
});
