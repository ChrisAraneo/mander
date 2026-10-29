import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { finishLevel } from './finish-level';

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

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState => ({
  ...createInitialState(LEVEL, 2, []),
  score: 500,
  time: 12.4,
  levelTimes: [30, 45],
});

describe('finishLevel', () => {
  it('should mark the level complete when the player finishes it', () => {
    const finished = finishLevel(createState());

    expect(finished.status).toBe('COMPLETE');
  });

  it('should add the score for the time taken when the player finishes the level', () => {
    const finished = finishLevel(createState());

    expect(finished.score).toBe(500 + 8800);
  });

  it('should add only the smallest score when the player took a very long time', () => {
    const state: GameState = { ...createState(), time: 500 };

    const finished = finishLevel(state);

    expect(finished.score).toBe(500 + 100);
  });

  it('should record the time taken after the earlier ones when the player finishes the level', () => {
    const finished = finishLevel(createState());

    expect(finished.levelTimes).toEqual([30, 45, 12.4]);
  });

  it('should record the time taken as the first one when no level was finished before', () => {
    const state: GameState = { ...createState(), levelTimes: [] };

    const finished = finishLevel(state);

    expect(finished.levelTimes).toEqual([12.4]);
  });

  it('should keep the player and the level when the player finishes the level', () => {
    const state = createState();

    const finished = finishLevel(state);

    expect(finished.player).toBe(state.player);
    expect(finished.level).toBe(state.level);
  });

  it('should leave the given state unchanged when the player finishes the level', () => {
    const state = createState();

    finishLevel(state);

    expect(state).toEqual(createState());
  });
});
