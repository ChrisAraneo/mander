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

import { advanceGhosts, createGhosts, getGhostStates } from './ghost-playback';

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
  it('should start every ghost from its own copy of the opening state when the ghosts are created', () => {
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

  it('should walk the ghost forward when its own recording is stepped on', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(60)], initialState),
      30,
    );

    expect(xOf(ghosts[0].playback.state)).toBeGreaterThan(xOf(initialState()));
  });

  it('should keep the state one step back when it walks a ghost forward', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(60)], initialState),
      30,
    );

    expect(xOf(ghosts[0].previous)).toBeLessThan(xOf(ghosts[0].playback.state));
  });

  it('should land on the same place when the steps come one at a time rather than in one batch', () => {
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

  it('should hold the ghost still when its run has played out', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10)], initialState),
      600,
    );
    const settled = advanceGhosts(ghosts, 600);

    expect(settled[0]).toBe(ghosts[0]);
  });

  it('should show only the ghosts whose run is still going when another has played out', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10), walkingRight(600)], initialState),
      20,
    );

    expect(getGhostStates(ghosts, 0)).toHaveLength(1);
  });

  it('should draw the ghost part-way between its steps when it is asked for mid-step', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(60)], initialState),
      30,
    );
    const [back] = getGhostStates(ghosts, 0);
    const [middle] = getGhostStates(ghosts, 0.5);
    const [front] = getGhostStates(ghosts, 1);

    expect(xOf(back)).toBeLessThan(xOf(middle));
    expect(xOf(middle)).toBeLessThan(xOf(front));
    expect(xOf(middle)).toBeCloseTo((xOf(back) + xOf(front)) / 2, 6);
  });

  it('should show nothing when every run has played out', () => {
    const ghosts = advanceGhosts(
      createGhosts([walkingRight(10), walkingRight(20)], initialState),
      600,
    );

    expect(getGhostStates(ghosts, 0)).toEqual([]);
  });

  it('should have no ghosts to run when the world has no other runs', () => {
    expect(getGhostStates(createGhosts([], initialState), 0)).toEqual([]);
  });
});
