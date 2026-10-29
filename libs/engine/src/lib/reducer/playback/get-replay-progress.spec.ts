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

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import type { GameState } from '../../types/game-state';
import { nextGameState } from '../next-game-state';
import { addRecordedAction } from '../recorder/add-recorded-action';
import { createEmptyReplay } from '../recorder/create-empty-replay';
import { createRecorder } from '../recorder/create-recorder';
import { toReplay } from '../recorder/to-replay';
import type { Replay } from '../recorder/types/replay';
import type { Action } from '../types/action';
import { createPlayback } from './create-playback';
import { getReplayProgress } from './get-replay-progress';
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
  shooterEnemyChance: 0,
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

const runScript = (): { state: GameState; replay: Replay } => ({
  state: reduce(
    SCRIPT,
    (state, action) => nextGameState(state, action, constant(0)),
    createState(),
  ),
  replay: toReplay(
    reduce(SCRIPT, addRecordedAction, createRecorder('TEST-WORLD')),
  ),
});

describe('getReplayProgress', () => {
  it('should walk from zero to one when the run plays through', () => {
    const { replay } = runScript();
    const start = createPlayback(createState());

    expect(getReplayProgress(replay, start)).toBe(0);

    const half = nextPlayback(replay, start, replay.steps / 2, constant(0));

    expect(getReplayProgress(replay, half)).toBeCloseTo(0.5, 6);

    const end = nextPlayback(replay, start, replay.steps * 2, constant(0));

    expect(getReplayProgress(replay, end)).toBe(1);
    expect(isReplayFinished(replay, end)).toBe(true);
  });

  it('should report the replay as complete when it is empty', () => {
    const replay = createEmptyReplay('TEST-WORLD');
    const playback = createPlayback(createState());

    expect(getReplayProgress(replay, playback)).toBe(1);
    expect(isReplayFinished(replay, playback)).toBe(true);
  });
});
