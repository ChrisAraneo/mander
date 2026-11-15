import {
  FIXED_STEP_SECONDS,
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
} from '@mander/model';
import { constant, head, map, reduce, size, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { nextGameState } from '../game/next-game-state';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { addRecordedAction } from '../recorder/add-recorded-action';
import { createRecorder } from '../recorder/create-recorder';
import { toReplay } from '../recorder/to-replay';
import type { Replay } from '../recorder/types/replay';
import { createInitialState } from '../start/create-initial-state';
import { removeUpdateTime } from '../state/remove-update-time';
import type { Action } from '../state/types/action';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { createPlayback } from './create-playback';
import { isReplayFinished } from './is-replay-finished';
import { nextPlayback } from './next-playback';
import type { ReplayPlayback } from './types/replay-playback';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  K: TILE_KEY,
  C: TILE_CHEST,
  P: TILE_PORTAL,
};

const ROWS = [
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#............................#',
  '#.S......................P...#',
  '#.S............K....C....P...#',
  '##############################',
  '##############################',
  '##############################',
];

const createItem = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createTestLevel = (): GameLevel => ({
  seed: 'REPLAY',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [createItem('CARD-0'), createItem('CARD-1')],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const createState = (): GameState =>
  createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, []);

const ONE_STEP = 1;

const FEW_STEPS = 4;

const SOME_STEPS = 7;

const ALL_STEPS = 260;

const NO_STEPS = 0;

const BACKWARD_STEPS = -30;

const TICK_ACTION: Action = { type: 'TICK' };

const SCRIPT: Action[] = [
  ...times(60, () => TICK_ACTION),
  { type: 'MOVE_RIGHT_START' },
  ...times(30, () => TICK_ACTION),
  { type: 'JUMP_START' },
  ...times(20, () => TICK_ACTION),
  { type: 'JUMP_STOP' },
  ...times(90, () => TICK_ACTION),
  { type: 'MOVE_RIGHT_STOP' },
  ...times(60, () => TICK_ACTION),
];

interface ScriptRun {
  state: GameState;
  replay: Replay;
}

const runScript = (): ScriptRun => ({
  state: reduce(
    SCRIPT,
    (state, action) => nextGameState(state, action, constant(0)),
    createState(),
  ),
  replay: toReplay(
    reduce(SCRIPT, addRecordedAction, createRecorder('TEST-WORLD')),
  ),
});

const nextPlaybackUntilFinished = (
  replay: Replay,
  playback: ReplayPlayback,
  stepsPerCall: number,
): ReplayPlayback =>
  match(isReplayFinished(replay, playback))
    .with(true, () => playback)
    .otherwise(() =>
      nextPlaybackUntilFinished(
        replay,
        nextPlayback(replay, playback, stepsPerCall, constant(0)),
        stepsPerCall,
      ),
    );

const runPlayback = (replay: Replay, stepsPerCall: number): GameState =>
  nextPlaybackUntilFinished(replay, createPlayback(createState()), stepsPerCall)
    .state;

describe('nextPlayback', () => {
  it('should reproduce the recorded run exactly when it plays to the end', () => {
    const { state, replay } = runScript();

    expect(removeUpdateTime(runPlayback(replay, ONE_STEP))).toEqual(
      removeUpdateTime(state),
    );
  });

  it('should reproduce the same run when a frame takes several steps at once', () => {
    const { state, replay } = runScript();

    expect(removeUpdateTime(runPlayback(replay, FEW_STEPS))).toEqual(
      removeUpdateTime(state),
    );
    expect(removeUpdateTime(runPlayback(replay, SOME_STEPS))).toEqual(
      removeUpdateTime(state),
    );
    expect(removeUpdateTime(runPlayback(replay, ALL_STEPS))).toEqual(
      removeUpdateTime(state),
    );
  });

  it('should apply the input when the step it was recorded on comes round', () => {
    const { replay } = runScript();
    const before = nextPlayback(
      replay,
      createPlayback(createState()),
      60,
      constant(0),
    );
    const after = nextPlayback(replay, before, ONE_STEP, constant(0));

    expect(before.index).toBe(0);
    expect(before.state.input.isRight).toBe(false);
    expect(after.index).toBe(1);
    expect(after.state.input.isRight).toBe(true);
  });

  it('should count a step for every step when it takes them', () => {
    const { replay } = runScript();
    const playback = nextPlayback(
      replay,
      createPlayback(createState()),
      11,
      constant(0),
    );

    expect(playback.step).toBe(11);
    expect(playback.state.time).toBeCloseTo(11 * FIXED_STEP_SECONDS, 6);
  });

  it('should hold the game still when no step is taken', () => {
    const { replay } = runScript();
    const start = nextPlayback(
      replay,
      createPlayback(createState()),
      5,
      constant(0),
    );
    const playback = nextPlayback(replay, start, NO_STEPS, constant(0));

    expect(playback.step).toBe(start.step);
    expect(playback.state).toBe(start.state);
  });

  it('should hold the playback where it is when the count is negative', () => {
    const { replay } = runScript();
    const start = nextPlayback(
      replay,
      createPlayback(createState()),
      30,
      constant(0),
    );
    const next = nextPlayback(replay, start, BACKWARD_STEPS, constant(0));

    expect(next.step).toBe(start.step);
    expect(next.index).toBe(start.index);
  });

  it('should stop at the end of the run when it is asked for more steps than are left', () => {
    const { replay } = runScript();
    const end = nextPlayback(
      replay,
      createPlayback(createState()),
      replay.steps * 3,
      constant(0),
    );

    expect(end.step).toBe(replay.steps);
    expect(isReplayFinished(replay, end)).toBe(true);
  });

  it('should leave the replay and the playback untouched when it takes a step', () => {
    const { replay } = runScript();
    const playback = createPlayback(createState());
    const replayBefore = structuredClone(replay);
    const playbackBefore = structuredClone(playback);

    nextPlayback(replay, playback, ONE_STEP, constant(0));

    expect(replay).toEqual(replayBefore);
    expect(playback).toEqual(playbackBefore);
  });
});
