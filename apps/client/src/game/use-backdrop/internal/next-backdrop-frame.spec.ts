import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { nextBackdropFrame } from './next-backdrop-frame';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
};

const createState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  ...patch,
});

describe('nextBackdropFrame', () => {
  it('should keep the scene moving when the level is still being played', () => {
    const idle = createState();

    const frame = nextBackdropFrame(
      { previous: idle, current: idle },
      { type: 'TICK' },
      idle,
      constant(0),
    );

    expect(frame.previous).toBe(idle);
    expect(frame.current.time).toBeGreaterThan(idle.time);
  });

  it('should go back to the idle scene when the level stops being played', () => {
    const idle = createState();
    const over = createState({ status: 'GAME_OVER', time: 5 });

    const frame = nextBackdropFrame(
      { previous: over, current: over },
      { type: 'TICK' },
      idle,
      constant(0),
    );

    expect(frame.previous).toBe(over);
    expect(frame.current).toBe(idle);
  });
});
