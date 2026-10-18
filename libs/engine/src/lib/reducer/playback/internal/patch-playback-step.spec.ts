import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, omit, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { applyActions } from '../../apply-actions';
import type { Replay } from '../../recorder/types/replay';
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
});

const createState = (): GameState =>
  createInitialState(createLevel(ROWS), 0, []);

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

const computeSimulation = (state: GameState): Omit<GameState, 'updateTime'> =>
  omit(state, 'updateTime');

describe('patchPlaybackStep', () => {
  it('should apply the inputs due on the step and then one tick when the step has inputs', () => {
    const playback = createPlaybackAt(0, 0);

    const next = patchPlaybackStep(createReplay(), playback);

    expect(computeSimulation(next.state)).toEqual(
      computeSimulation(
        applyActions(createState(), [
          { type: 'MOVE_RIGHT_START' },
          { type: 'JUMP_START' },
          { type: 'TICK' },
        ]),
      ),
    );
    expect(next.state.input.isRight).toBe(true);
    expect(next.state.input.isJump).toBe(true);
  });

  it('should move on one step and past the inputs it applied when the step has inputs', () => {
    const playback = createPlaybackAt(0, 0);

    const next = patchPlaybackStep(createReplay(), playback);

    expect(next.step).toBe(1);
    expect(next.index).toBe(2);
  });

  it('should apply only one tick when no input is due on the step', () => {
    const playback = createPlaybackAt(1, 2);

    const next = patchPlaybackStep(createReplay(), playback);

    expect(computeSimulation(next.state)).toEqual(
      computeSimulation(applyActions(createState(), [{ type: 'TICK' }])),
    );
    expect(next.state.input.isRight).toBe(false);
    expect(next.step).toBe(2);
    expect(next.index).toBe(2);
  });

  it('should apply only one tick when every input has been played', () => {
    const playback = createPlaybackAt(3, 3);

    const next = patchPlaybackStep(createReplay(), playback);

    expect(computeSimulation(next.state)).toEqual(
      computeSimulation(applyActions(createState(), [{ type: 'TICK' }])),
    );
    expect(next.step).toBe(4);
    expect(next.index).toBe(3);
  });

  it('should leave the playback and the replay it was given alone when it takes a step', () => {
    const playback = createPlaybackAt(0, 0);
    const replay = createReplay();

    patchPlaybackStep(replay, playback);

    expect(playback).toEqual(createPlaybackAt(0, 0));
    expect(replay).toEqual(createReplay());
  });
});
