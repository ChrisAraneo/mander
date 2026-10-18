import { FIXED_STEP_SECONDS, type Item, type Tile, TILE_AIR, TILE_CHEST, TILE_DIRT, TILE_KEY, TILE_PORTAL, TILE_SPAWN, chain } from '@mander/model';
import { head, map, omit, reduce as fold, size, times, tap } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { createRecorder } from '../recorder/create-recorder';
import type { Replay } from '../recorder/types/replay';
import { reduce } from '../reduce';
import type { Action } from '../types/action';
import { advancePlayback } from './advance-playback';
import { createPlayback } from './create-playback';
import { isReplayFinished } from './is-replay-finished';
import type { ReplayPlayback } from './types/replay-playback';

const computeSimulation = (state: GameState): Omit<GameState, 'updateTime'> =>
  omit(state, 'updateTime');

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
});

const createState = (): GameState =>
  createInitialState(createTestLevel(), 0, []);

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

const runScript = (): { state: GameState; replay: Replay } =>
  chain(createRecorder('TEST-WORLD'))
    .thru((recorder) => ({
      recorder,
      state: fold(
        SCRIPT,
        (state, action) =>
          reduce(
            tap(state, () => recorder.record(action)),
            action,
          ),
        createState(),
      ),
    }))
    .thru(({ recorder, state }) => ({ state, replay: recorder.snapshot() }))
    .value();

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
        advancePlayback(replay, playback, stepsPerCall),
        stepsPerCall,
      ),
    );

const runPlayback = (replay: Replay, stepsPerCall: number): GameState =>
  nextPlaybackUntilFinished(replay, createPlayback(createState()), stepsPerCall)
    .state;

describe('advancePlayback', () => {
  it('should reproduce the recorded run exactly when it plays to the end', () => {
    const { state, replay } = runScript();

    expect(computeSimulation(runPlayback(replay, 1))).toEqual(
      computeSimulation(state),
    );
  });

  it('should reproduce the same run when a frame takes several steps at once', () => {
    const { state, replay } = runScript();

    expect(computeSimulation(runPlayback(replay, 4))).toEqual(
      computeSimulation(state),
    );
    expect(computeSimulation(runPlayback(replay, 7))).toEqual(
      computeSimulation(state),
    );
    expect(computeSimulation(runPlayback(replay, 260))).toEqual(
      computeSimulation(state),
    );
  });

  it('should apply the input when the step it was recorded on comes round', () => {
    const { replay } = runScript();
    const before = advancePlayback(replay, createPlayback(createState()), 60);
    const after = advancePlayback(replay, before, 1);

    expect(before.index).toBe(0);
    expect(before.state.input.isRight).toBe(false);
    expect(after.index).toBe(1);
    expect(after.state.input.isRight).toBe(true);
  });

  it('should count a step for every step when it takes them', () => {
    const { replay } = runScript();
    const playback = advancePlayback(replay, createPlayback(createState()), 11);

    expect(playback.step).toBe(11);
    expect(playback.state.time).toBeCloseTo(11 * FIXED_STEP_SECONDS, 6);
  });

  it('should hold the state still when no step is taken', () => {
    const { replay } = runScript();
    const start = advancePlayback(replay, createPlayback(createState()), 5);
    const playback = advancePlayback(replay, start, 0);

    expect(playback.step).toBe(start.step);
    expect(playback.state).toBe(start.state);
  });

  it('should hold the playback where it is when the count is negative', () => {
    const { replay } = runScript();
    const start = advancePlayback(replay, createPlayback(createState()), 30);
    const next = advancePlayback(replay, start, -30);

    expect(next.step).toBe(start.step);
    expect(next.index).toBe(start.index);
  });

  it('should stop at the end of the run when it is asked for more steps than are left', () => {
    const { replay } = runScript();
    const end = advancePlayback(
      replay,
      createPlayback(createState()),
      replay.steps * 3,
    );

    expect(end.step).toBe(replay.steps);
    expect(isReplayFinished(replay, end)).toBe(true);
  });
});
