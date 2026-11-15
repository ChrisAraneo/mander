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
import { constant, head, map, reduce, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { nextGameState } from '../game/next-game-state';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { addRecordedAction } from '../recorder/add-recorded-action';
import { createEmptyReplay } from '../recorder/create-empty-replay';
import { createRecorder } from '../recorder/create-recorder';
import { toReplay } from '../recorder/to-replay';
import type { Replay } from '../recorder/types/replay';
import { createInitialState } from '../start/create-initial-state';
import type { Action } from '../state/types/action';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { computeReplayProgress } from './compute-replay-progress';
import { createPlayback } from './create-playback';
import { isReplayFinished } from './is-replay-finished';
import { nextPlayback } from './next-playback';

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

describe('computeReplayProgress', () => {
  it('should walk from zero to one when the run plays through', () => {
    const { replay } = runScript();
    const start = createPlayback(createState());

    expect(computeReplayProgress(replay, start)).toBe(0);

    const half = nextPlayback(replay, start, replay.steps / 2, constant(0));

    expect(computeReplayProgress(replay, half)).toBeCloseTo(0.5, 6);

    const end = nextPlayback(replay, start, replay.steps * 2, constant(0));

    expect(computeReplayProgress(replay, end)).toBe(1);
    expect(isReplayFinished(replay, end)).toBe(true);
  });

  it('should report the replay as complete when it is empty', () => {
    const replay = createEmptyReplay('TEST-WORLD');
    const playback = createPlayback(createState());

    expect(computeReplayProgress(replay, playback)).toBe(1);
    expect(isReplayFinished(replay, playback)).toBe(true);
  });

  it('should leave the replay and the playback untouched when it works out how far along it is', () => {
    const { replay } = runScript();
    const playback = createPlayback(createState());
    const replayBefore = structuredClone(replay);
    const playbackBefore = structuredClone(playback);

    computeReplayProgress(replay, playback);

    expect(replay).toEqual(replayBefore);
    expect(playback).toEqual(playbackBefore);
  });
});
