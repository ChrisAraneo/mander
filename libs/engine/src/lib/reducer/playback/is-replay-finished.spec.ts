import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import { createEmptyReplay } from '../recorder/create-empty-replay';
import type { Replay } from '../recorder/types/replay';
import { isReplayFinished } from './is-replay-finished';
import type { ReplayPlayback } from './types/replay-playback';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = ['#....#', '#S...#', '######'];

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const STATE = createInitialState(createLevel(ROWS), 0, []);

const REPLAY: Replay = { worldName: 'WORLD', steps: 10, entries: [] };

const createPlaybackAt = (step: number): ReplayPlayback => ({
  step,
  index: 0,
  state: STATE,
});

describe('isReplayFinished', () => {
  it('should say no when the playback has not reached the last step', () => {
    const isFinished = isReplayFinished(REPLAY, createPlaybackAt(9));

    expect(isFinished).toBe(false);
  });

  it('should say no when the playback is at the very start', () => {
    const isFinished = isReplayFinished(REPLAY, createPlaybackAt(0));

    expect(isFinished).toBe(false);
  });

  it('should say yes when the playback has reached the last step', () => {
    const isFinished = isReplayFinished(REPLAY, createPlaybackAt(10));

    expect(isFinished).toBe(true);
  });

  it('should say yes when the playback has gone past the last step', () => {
    const isFinished = isReplayFinished(REPLAY, createPlaybackAt(11));

    expect(isFinished).toBe(true);
  });

  it('should say yes at once when the replay is empty', () => {
    const isFinished = isReplayFinished(
      createEmptyReplay('WORLD'),
      createPlaybackAt(0),
    );

    expect(isFinished).toBe(true);
  });
});
