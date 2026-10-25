import type { GameState } from '@mander/engine';
import type { Player } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getLevelGhosts } from './get-level-ghosts';

const createPlayer = (positionX: number): Player =>
  ({ position: { x: positionX, y: 0 } }) as unknown as Player;

const createState = (
  levelIndex: number,
  positionX: number,
  time: number,
): GameState =>
  ({
    levelIndex,
    time,
    player: createPlayer(positionX),
  }) as unknown as GameState;

describe('getLevelGhosts', () => {
  it('should draw the ghosts when they stand in the level on screen', () => {
    const watched = createState(1, 0, 10);
    const ghosts = [createState(1, 40, 8), createState(1, 90, 9)];

    expect(
      map(getLevelGhosts(watched, ghosts), (ghost) => ghost.player),
    ).toEqual([createPlayer(40), createPlayer(90)]);
  });

  it('should leave the ghosts out when they are off in another level', () => {
    const watched = createState(1, 0, 10);
    const ghosts = [createState(0, 40, 8), createState(2, 90, 9)];

    expect(getLevelGhosts(watched, ghosts)).toEqual([]);
  });

  it('should animate each ghost on the clock of its own run when the runs are at different times', () => {
    const watched = createState(0, 0, 10);
    const ghosts = [createState(0, 40, 3.5)];

    expect(getLevelGhosts(watched, ghosts)[0].time).toBe(3.5);
  });

  it('should draw nothing when no other run is on the level', () => {
    expect(getLevelGhosts(createState(0, 0, 1), [])).toEqual([]);
  });
});
