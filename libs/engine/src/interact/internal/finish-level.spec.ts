import { describe, expect, it } from 'vitest';

import {
  LEVEL_SCORE_BASE,
  LEVEL_SCORE_MIN,
  LEVEL_SCORE_PER_SECOND,
} from '../../score/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import { createInteractTestLevel } from '../create-interact-test-level';
import { finishLevel } from './finish-level';

const LEVEL = createInteractTestLevel();

const START_SCORE = 500;

const LEVEL_SECONDS = 12.4;

const ROUNDED_SECONDS = 12;

const LEVEL_SCORE = LEVEL_SCORE_BASE - LEVEL_SCORE_PER_SECOND * ROUNDED_SECONDS;

const EARLIER_LEVEL_SECONDS = 30;

const SLOW_SECONDS = 500;

const SECOND_LEVEL_INDEX = 2;

const OTHER_LEVEL_SECONDS = 45;

const createState = (): GameState => ({
  ...createInitialState(LEVEL, SECOND_LEVEL_INDEX, []),
  score: START_SCORE,
  time: LEVEL_SECONDS,
  levelTimes: [EARLIER_LEVEL_SECONDS, OTHER_LEVEL_SECONDS],
});

describe('finishLevel', () => {
  it('should mark the level complete when the player finishes it', () => {
    const finished = finishLevel(createState());

    expect(finished.status).toBe('COMPLETE');
  });

  it('should add the score for the time taken when the player finishes the level', () => {
    const finished = finishLevel(createState());

    expect(finished.score).toBe(START_SCORE + LEVEL_SCORE);
  });

  it('should add only the smallest score when the player took a very long time', () => {
    const state: GameState = { ...createState(), time: SLOW_SECONDS };

    const finished = finishLevel(state);

    expect(finished.score).toBe(START_SCORE + LEVEL_SCORE_MIN);
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

  it('should leave the level it was handed untouched when the player finishes it', () => {
    const state = createState();

    finishLevel(state);

    expect(state).toEqual(createState());
  });
});
