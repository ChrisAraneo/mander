import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { shouldWriteScore } from './should-write-score';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
};

const createState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  ...patch,
});

const WORLD = {
  name: 'ABC',
  season: 'SPRING' as const,
  levels: [LEVEL, LEVEL],
  score: 0,
};

describe('shouldWriteScore', () => {
  it('should write the score when a level before the last has just been completed', () => {
    expect(
      shouldWriteScore(
        WORLD,
        createState(),
        createState({ status: 'COMPLETE', levelIndex: 0 }),
      ),
    ).toBe(true);
  });

  it('should not write the score again when the level was already complete', () => {
    expect(
      shouldWriteScore(
        WORLD,
        createState({ status: 'COMPLETE' }),
        createState({ status: 'COMPLETE' }),
      ),
    ).toBe(false);
  });

  it('should not write the score when the last level has been completed', () => {
    expect(
      shouldWriteScore(
        WORLD,
        createState({ levelIndex: 1 }),
        createState({ status: 'COMPLETE', levelIndex: 1 }),
      ),
    ).toBe(false);
  });

  it('should not write the score when the level is still being played', () => {
    expect(shouldWriteScore(WORLD, createState(), createState())).toBe(false);
  });
});
