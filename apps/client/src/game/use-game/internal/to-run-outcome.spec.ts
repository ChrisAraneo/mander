import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toRunOutcome } from './to-run-outcome';

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

describe('toRunOutcome', () => {
  it('should call the run a death when the player is out of hearts', () => {
    expect(toRunOutcome(createState({ status: 'GAME_OVER' }))).toBe(
      'GAME_OVER',
    );
  });

  it('should call the run finished when the level is complete', () => {
    expect(toRunOutcome(createState({ status: 'COMPLETE' }))).toBe('COMPLETE');
  });
});
