import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createGameStartFrame } from './create-game-start-frame';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const createState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  ...patch,
});

describe('createGameStartFrame', () => {
  it('should show the opening state on both sides when the game starts', () => {
    const state = createState();

    const frame = createGameStartFrame(state);

    expect(frame.previous).toBe(state);
    expect(frame.current).toBe(state);
  });
});
