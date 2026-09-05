import {
  type Action,
  createInitialState,
  createRecorder,
  type GameLevel,
  type GameState,
  type Replay,
} from '@mander/engine';
import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { advanceGhosts, createGhosts, ghostStates } from './ghost-playback';

const WIDTH = 20;
const HEIGHT = 12;
const GROUND_ROW = 9;

const tickAction: Action = { type: 'TICK' };

const testLevel = (): GameLevel => {
  const tiles: Tile[][] = times(HEIGHT, (y) =>
    times(WIDTH, (x): Tile => {
      if (x === 0 || x === WIDTH - 1) return TILE_DIRT;
      return y >= GROUND_ROW ? TILE_DIRT : TILE_AIR;
    }),
  );
  tiles[GROUND_ROW - 1][2] = TILE_SPAWN;
  tiles[GROUND_ROW - 2][2] = TILE_SPAWN;

  return {
    seed: 'GHOST',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    chestItems: [],
    hornedEnemyChance: 0,
  };
};

const LEVEL = testLevel();

const initialState = (): GameState => createInitialState(LEVEL, 0, []);

const recordingOf = (script: Action[]): Replay => {
  const recorder = createRecorder('GHOST');
  script.forEach((action) => recorder.record(action));
  return recorder.snapshot();
};

const walkingRight = (steps: number): Replay =>
  recordingOf([
    { type: 'MOVE_RIGHT_START' },
    ...times(steps, () => tickAction),
  ]);

const xOf = (state: GameState): number => state.player.position.x;

describe('the ghosts running alongside a replay', () => {
  it('starts every ghost from its own copy of the opening state', () => {
    const ghosts = createGhosts(
      [walkingRight(30), walkingRight(30)],
      initialState,
    );

    expect(ghosts).toHaveLength(2);
    expect(ghosts[0].playback.state).not.toBe(ghosts[1].playback.state);
    expect(map(ghosts, (ghost) => xOf(ghost.playback.state))).toEqual([
      xOf(initialState()),
      xOf(initialState()),
    ]);
  });

  it('walks each ghost forward on its own recording', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(60)], initialState),
      30,
    );

    expect(xOf(ghosts[0].playback.state)).toBeGreaterThan(xOf(initialState()));
  });

  it('keeps the state one step back to draw across', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(60)], initialState),
      30,
    );

    expect(xOf(ghosts[0].previous)).toBeLessThan(xOf(ghosts[0].playback.state));
  });

  it('lands on the same place whether the steps come in one batch or many', () => {
    const [batched] = advanceGhosts(
      createGhosts([walkingRight(60)], initialState),
      40,
    );
    const drip = times(40).reduce(
      (ghosts) => advanceGhosts(ghosts, 1),
      createGhosts([walkingRight(60)], initialState),
    );

    expect(xOf(drip[0].playback.state)).toBe(xOf(batched.playback.state));
  });

  it('holds a ghost still once its run has played out', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10)], initialState),
      600,
    );
    const settled = advanceGhosts(ghosts, 600);

    expect(settled[0]).toBe(ghosts[0]);
  });

  it('shows only the ghosts whose run is still going', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10), walkingRight(600)], initialState),
      20,
    );

    expect(ghostStates(ghosts, 0)).toHaveLength(1);
  });

  it('draws a ghost part-way between the steps it took', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(60)], initialState),
      30,
    );
    const [back] = ghostStates(ghosts, 0);
    const [middle] = ghostStates(ghosts, 0.5);
    const [front] = ghostStates(ghosts, 1);

    expect(xOf(back)).toBeLessThan(xOf(middle));
    expect(xOf(middle)).toBeLessThan(xOf(front));
    expect(xOf(middle)).toBeCloseTo((xOf(back) + xOf(front)) / 2, 6);
  });

  it('shows nothing once every run has played out', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10), walkingRight(20)], initialState),
      600,
    );

    expect(ghostStates(ghosts, 0)).toEqual([]);
  });

  it('has no ghosts to run when the world has no other runs', () => {
    expect(ghostStates(createGhosts([], initialState), 0)).toEqual([]);
  });
});
