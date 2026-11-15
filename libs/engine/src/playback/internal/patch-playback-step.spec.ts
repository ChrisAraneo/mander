import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { constant, head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { patchGameState } from '../../game/patch-game-state';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import type { Replay } from '../../recorder/types/replay';
import { createInitialState } from '../../start/create-initial-state';
import { removeUpdateTime } from '../../state/remove-update-time';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import type { ReplayPlayback } from '../types/replay-playback';
import { patchPlaybackStep } from './patch-playback-step';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = ['#......#', '#......#', '#S.....#', '########'];

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const createState = (): GameState =>
  createInitialState(createLevel(ROWS), FIRST_LEVEL_INDEX, []);

const createReplay = (): Replay => ({
  worldName: 'WORLD',
  steps: 4,
  entries: [
    { atStep: 0, action: { type: 'MOVE_RIGHT_START' } },
    { atStep: 0, action: { type: 'JUMP_START' } },
    { atStep: 2, action: { type: 'MOVE_RIGHT_STOP' } },
  ],
});

const createPlaybackAt = (step: number, index: number): ReplayPlayback => ({
  step,
  index,
  state: createState(),
});

describe('patchPlaybackStep', () => {
  it('should apply the inputs due on the step and then one tick when the step has inputs', () => {
    const playback = createPlaybackAt(0, 0);

    const next = patchPlaybackStep(createReplay(), playback, constant(0));

    expect(removeUpdateTime(next.state)).toEqual(
      removeUpdateTime(
        patchGameState(
          createState(),
          [
            { type: 'MOVE_RIGHT_START' },
            { type: 'JUMP_START' },
            { type: 'TICK' },
          ],
          constant(0),
        ),
      ),
    );
    expect(next.state.input.isRight).toBe(true);
    expect(next.state.input.isJump).toBe(true);
  });

  it('should move on one step and past the inputs it applied when the step has inputs', () => {
    const playback = createPlaybackAt(0, 0);

    const next = patchPlaybackStep(createReplay(), playback, constant(0));

    expect(next.step).toBe(1);
    expect(next.index).toBe(2);
  });

  it('should apply only one tick when no input is due on the step', () => {
    const playback = createPlaybackAt(1, 2);

    const next = patchPlaybackStep(createReplay(), playback, constant(0));

    expect(removeUpdateTime(next.state)).toEqual(
      removeUpdateTime(
        patchGameState(createState(), [{ type: 'TICK' }], constant(0)),
      ),
    );
    expect(next.state.input.isRight).toBe(false);
    expect(next.step).toBe(2);
    expect(next.index).toBe(2);
  });

  it('should apply only one tick when every input has been played', () => {
    const playback = createPlaybackAt(3, 3);

    const next = patchPlaybackStep(createReplay(), playback, constant(0));

    expect(removeUpdateTime(next.state)).toEqual(
      removeUpdateTime(
        patchGameState(createState(), [{ type: 'TICK' }], constant(0)),
      ),
    );
    expect(next.step).toBe(4);
    expect(next.index).toBe(3);
  });

  it('should leave the playback and the replay it was given alone when it takes a step', () => {
    const playback = createPlaybackAt(0, 0);
    const replay = createReplay();

    patchPlaybackStep(replay, playback, constant(0));

    expect(playback).toEqual(createPlaybackAt(0, 0));
    expect(replay).toEqual(createReplay());
  });
});
