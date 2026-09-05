import type { GameState } from '@mander/engine';
import type { Player } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { levelGhosts } from './level-ghosts';

const playerAt = (x: number): Player =>
  ({ position: { x, y: 0 } }) as unknown as Player;

const stateOf = (levelIndex: number, x: number, time: number): GameState =>
  ({ levelIndex, time, player: playerAt(x) }) as unknown as GameState;

describe('the ghosts drawn over a level', () => {
  it('draws the ghosts standing in the level on screen', () => {
    const watched = stateOf(1, 0, 10);
    const ghosts = [stateOf(1, 40, 8), stateOf(1, 90, 9)];

    expect(map(levelGhosts(watched, ghosts), (ghost) => ghost.player)).toEqual([
      playerAt(40),
      playerAt(90),
    ]);
  });

  it('leaves out the ghosts who are off in another level', () => {
    const watched = stateOf(1, 0, 10);
    const ghosts = [stateOf(0, 40, 8), stateOf(2, 90, 9)];

    expect(levelGhosts(watched, ghosts)).toEqual([]);
  });

  it('animates each ghost on the clock of its own run', () => {
    const watched = stateOf(0, 0, 10);
    const ghosts = [stateOf(0, 40, 3.5)];

    expect(levelGhosts(watched, ghosts)[0].time).toBe(3.5);
  });

  it('draws nothing when no other run is on the level', () => {
    expect(levelGhosts(stateOf(0, 0, 1), [])).toEqual([]);
  });
});
