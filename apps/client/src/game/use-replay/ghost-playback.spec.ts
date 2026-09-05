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
const FRAME_MS = 1000 / 60;

const tickAction: Action = { type: 'TICK', deltaSeconds: 1 / 60 };

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
  script.forEach((action, index) => recorder.record(action, index * FRAME_MS));
  return recorder.snapshot();
};

const walkingRight = (frames: number): Replay =>
  recordingOf([
    { type: 'MOVE_RIGHT_START' },
    ...times(frames, () => tickAction),
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
      30 * FRAME_MS,
    );

    expect(xOf(ghosts[0].playback.state)).toBeGreaterThan(xOf(initialState()));
  });

  it('holds a ghost still once its run has played out', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10)], initialState),
      10_000,
    );
    const settled = advanceGhosts(ghosts, 10_000);

    expect(settled[0]).toBe(ghosts[0]);
  });

  it('shows only the ghosts whose run is still going', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10), walkingRight(600)], initialState),
      20 * FRAME_MS,
    );

    expect(ghostStates(ghosts)).toHaveLength(1);
  });

  it('shows nothing once every run has played out', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10), walkingRight(20)], initialState),
      10_000,
    );

    expect(ghostStates(ghosts)).toEqual([]);
  });

  it('has no ghosts to run when the world has no other runs', () => {
    expect(ghostStates(createGhosts([], initialState))).toEqual([]);
  });
});
