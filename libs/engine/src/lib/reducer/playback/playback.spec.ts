import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { omit } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Action } from '../../actions/types/actions';
import type { GameLevel } from '../../types/game-level';
import { reduce } from '../reduce';
import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import { advancePlayback } from './advance-playback';
import { createPlayback } from './create-playback';
import { createRecorder } from '../recorder/create-recorder';
import { emptyReplay } from '../recorder/empty-replay';
import { isReplayFinished } from './is-replay-finished';
import type { Replay } from '../recorder/types/replay';
import { replayDuration } from './replay-duration';
import { replayProgress } from './replay-progress';

const simulation = (state: GameState): Omit<GameState, 'updateTime'> =>
  omit(state, 'updateTime');

const WIDTH = 30;
const HEIGHT = 15;
const GROUND_ROW = 12;
const DELTA_SECONDS = 1 / 60;
const FRAME_MS = 1000 / 60;

const item = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  art: 'GEM',
  effect: { kind: 'NONE' },
});

const testLevel = (): GameLevel => {
  const tiles: Tile[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    const fillTile: Tile = y >= GROUND_ROW ? TILE_DIRT : TILE_AIR;
    const row: Tile[] = Array.from({ length: WIDTH }, () => fillTile);
    row[0] = TILE_DIRT;
    row[WIDTH - 1] = TILE_DIRT;
    tiles.push(row);
  }
  tiles[GROUND_ROW - 1][2] = TILE_SPAWN;
  tiles[GROUND_ROW - 2][2] = TILE_SPAWN;
  tiles[GROUND_ROW - 1][15] = TILE_KEY;
  tiles[GROUND_ROW - 1][20] = TILE_CHEST;
  tiles[GROUND_ROW - 1][25] = TILE_PORTAL;
  tiles[GROUND_ROW - 2][25] = TILE_PORTAL;

  return {
    seed: 'REPLAY',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    chestItems: [item('CARD-0'), item('CARD-1')],
    hornedEnemyChance: 0,
  };
};

const initialState = (): GameState => createInitialState(testLevel(), 0, []);

const tickAction: Action = { type: 'TICK', deltaSeconds: DELTA_SECONDS };

const runScript = (): { state: GameState; replay: Replay } => {
  const recorder = createRecorder('TEST-WORLD');
  const script: Action[] = [
    ...Array.from({ length: 60 }, () => tickAction),
    { type: 'MOVE_RIGHT_START' },
    ...Array.from({ length: 30 }, () => tickAction),
    { type: 'JUMP_START' },
    ...Array.from({ length: 20 }, () => tickAction),
    { type: 'JUMP_STOP' },
    ...Array.from({ length: 90 }, () => tickAction),
    { type: 'MOVE_RIGHT_STOP' },
    ...Array.from({ length: 60 }, () => tickAction),
  ];

  let state = initialState();
  script.forEach((action, index) => {
    recorder.record(action, 5_000 + index * FRAME_MS);
    state = reduce(state, action);
  });

  return { state, replay: recorder.snapshot() };
};

const playToEnd = (replay: Replay, stepMs: number): GameState => {
  let playback = createPlayback(initialState());
  while (!isReplayFinished(replay, playback)) {
    playback = advancePlayback(replay, playback, stepMs);
  }
  return playback.state;
};

describe('replayDuration', () => {
  it('is zero for an empty replay', () => {
    expect(replayDuration(emptyReplay('TEST-WORLD'))).toBe(0);
  });

  it('is the timestamp of the last entry', () => {
    const { replay } = runScript();
    expect(replayDuration(replay)).toBeCloseTo(263 * FRAME_MS, 6);
  });
});

describe('advancePlayback', () => {
  it('reproduces the recorded run exactly', () => {
    const { state, replay } = runScript();
    expect(simulation(playToEnd(replay, FRAME_MS))).toEqual(simulation(state));
  });

  it('reproduces the same run whatever the frame pacing', () => {
    const { state, replay } = runScript();
    expect(simulation(playToEnd(replay, FRAME_MS * 4))).toEqual(
      simulation(state),
    );
    expect(simulation(playToEnd(replay, 1))).toEqual(simulation(state));
  });

  it('releases only the actions that are due', () => {
    const { replay } = runScript();
    const playback = advancePlayback(
      replay,
      createPlayback(initialState()),
      FRAME_MS * 10 + 1,
    );

    expect(playback.index).toBe(11);
    expect(playback.state.time).toBeCloseTo(11 * DELTA_SECONDS, 6);
  });

  it('holds the state still when no time passes', () => {
    const { replay } = runScript();
    const start = createPlayback(initialState());
    const playback = advancePlayback(
      replay,
      advancePlayback(replay, start, 0),
      0,
    );

    expect(playback.index).toBe(1);
    expect(playback.elapsedMs).toBe(0);
  });

  it('never rewinds on a negative delta', () => {
    const { replay } = runScript();
    const start = advancePlayback(replay, createPlayback(initialState()), 500);
    const next = advancePlayback(replay, start, -500);

    expect(next.elapsedMs).toBe(start.elapsedMs);
    expect(next.index).toBe(start.index);
  });
});

describe('replayProgress', () => {
  it('walks from zero to one across the run', () => {
    const { replay } = runScript();
    const start = createPlayback(initialState());
    expect(replayProgress(replay, start)).toBe(0);

    const half = advancePlayback(replay, start, replayDuration(replay) / 2);
    expect(replayProgress(replay, half)).toBeCloseTo(0.5, 6);

    const end = advancePlayback(replay, start, replayDuration(replay) * 2);
    expect(replayProgress(replay, end)).toBe(1);
    expect(isReplayFinished(replay, end)).toBe(true);
  });

  it('reports an empty replay as complete', () => {
    const replay = emptyReplay('TEST-WORLD');
    const playback = createPlayback(initialState());

    expect(replayProgress(replay, playback)).toBe(1);
    expect(isReplayFinished(replay, playback)).toBe(true);
  });
});
