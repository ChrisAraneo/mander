import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createFinishedRun } from './create-finished-run';

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

const REPLAY = { worldName: 'ABC', steps: 1, entries: [[0, 1]] };

describe('createFinishedRun', () => {
  it('should describe the run with how far it got and what it scored', () => {
    expect(
      createFinishedRun(
        createState({ score: 450, levelIndex: 3 }),
        'GAME_OVER',
        35,
        'ABC',
        '2026-09-04',
        REPLAY,
      ),
    ).toEqual({
      name: 'ABC',
      day: '2026-09-04',
      outcome: 'GAME_OVER',
      score: 450,
      seconds: 35,
      levelIndex: 3,
      replay: REPLAY,
    });
  });

  it('should keep the replay it is given when it describes the run', () => {
    expect(
      createFinishedRun(createState(), 'COMPLETE', 0, 'ABC', '', REPLAY).replay,
    ).toBe(REPLAY);
  });
});
