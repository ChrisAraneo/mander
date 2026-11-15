import {
  FIXED_STEP_MS,
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
import { computeReplayDuration } from './compute-replay-duration';

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

describe('computeReplayDuration', () => {
  it('should be zero when the replay is empty', () => {
    expect(computeReplayDuration(createEmptyReplay('TEST-WORLD'))).toBe(0);
  });

  it('should be one step length for every step when the run was recorded', () => {
    const { replay } = runScript();

    expect(replay.steps).toBe(260);
    expect(computeReplayDuration(replay)).toBeCloseTo(260 * FIXED_STEP_MS, 6);
  });

  it('should leave the replay it was handed untouched when it works out how long it runs', () => {
    const { replay } = runScript();
    const before = structuredClone(replay);

    computeReplayDuration(replay);

    expect(replay).toEqual(before);
  });
});
