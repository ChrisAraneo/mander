import {
  createInitialState,
  type GameLevel,
  type GameState,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { filterPlaying } from './filter-playing';

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

describe('filterPlaying', () => {
  it('should keep the next scene when the level is still being played', () => {
    const next = createState({ time: 5 });

    expect(filterPlaying(createState(), next)).toBe(next);
  });

  it('should go back to the idle scene when the player has died', () => {
    const idle = createState();

    expect(filterPlaying(idle, createState({ status: 'GAME_OVER' }))).toBe(
      idle,
    );
  });

  it('should go back to the idle scene when the level is finished', () => {
    const idle = createState();

    expect(filterPlaying(idle, createState({ status: 'COMPLETE' }))).toBe(idle);
  });

  it('should go back to the idle scene when the chest is open', () => {
    const idle = createState();

    expect(filterPlaying(idle, createState({ status: 'CHEST' }))).toBe(idle);
  });
});
