import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeRunSeconds } from './compute-run-seconds';

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

describe('computeRunSeconds', () => {
  it('should count the level it happened on when the run ended in death', () => {
    expect(
      computeRunSeconds(
        createState({ status: 'GAME_OVER', levelTimes: [10, 20], time: 5 }),
      ),
    ).toBe(35);
  });

  it('should not count the last level twice when the run was finished', () => {
    expect(
      computeRunSeconds(
        createState({ status: 'COMPLETE', levelTimes: [10, 20], time: 20 }),
      ),
    ).toBe(30);
  });

  it('should count the level under way when the run is still being played', () => {
    expect(computeRunSeconds(createState({ levelTimes: [10], time: 4 }))).toBe(
      14,
    );
  });

  it('should count nothing when no time has passed', () => {
    expect(computeRunSeconds(createState())).toBe(0);
  });
});
