import type { GameState } from '@mander/engine';
import type { Player } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getLevelGhosts } from './get-level-ghosts';

const playerAt = (x: number): Player =>
  ({ position: { x, y: 0 } }) as unknown as Player;

const stateOf = (levelIndex: number, x: number, time: number): GameState =>
  ({ levelIndex, time, player: playerAt(x) }) as unknown as GameState;

describe('the ghosts drawn over a level', () => {
  it('should draw the ghosts when they stand in the level on screen', () => {
    const watched = stateOf(1, 0, 10);
    const ghosts = [stateOf(1, 40, 8), stateOf(1, 90, 9)];

    expect(
      map(getLevelGhosts(watched, ghosts), (ghost) => ghost.player),
    ).toEqual([playerAt(40), playerAt(90)]);
  });

  it('should leave the ghosts out when they are off in another level', () => {
    const watched = stateOf(1, 0, 10);
    const ghosts = [stateOf(0, 40, 8), stateOf(2, 90, 9)];

    expect(getLevelGhosts(watched, ghosts)).toEqual([]);
  });

  it('should animate each ghost on the clock of its own run when the runs are at different times', () => {
    const watched = stateOf(0, 0, 10);
    const ghosts = [stateOf(0, 40, 3.5)];

    expect(getLevelGhosts(watched, ghosts)[0].time).toBe(3.5);
  });

  it('should draw nothing when no other run is on the level', () => {
    expect(getLevelGhosts(stateOf(0, 0, 1), [])).toEqual([]);
  });
});
