import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { nextGameFrame } from './next-game-frame';

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

describe('nextGameFrame', () => {
  it('should keep the state before the tick when the game ticks', () => {
    const state = createState();

    const frame = nextGameFrame(
      { previous: state, current: state },
      { type: 'TICK' },
      constant(0),
    );

    expect(frame.previous).toBe(state);
    expect(frame.current.time).toBeGreaterThan(state.time);
  });

  it('should keep the state from before the last tick when the action is not a tick', () => {
    const previous = createState();
    const current = createState({ time: 1 });

    const frame = nextGameFrame(
      { previous, current },
      { type: 'MOVE_LEFT_START' },
      constant(0),
    );

    expect(frame.previous).toBe(previous);
    expect(frame.current.input.isLeft).toBe(true);
  });

  it('should not change the old frame when it moves the game on', () => {
    const state = createState();
    const frame = { previous: state, current: state };

    nextGameFrame(frame, { type: 'TICK' }, constant(0));

    expect(frame).toEqual({ previous: createState(), current: createState() });
  });
});
