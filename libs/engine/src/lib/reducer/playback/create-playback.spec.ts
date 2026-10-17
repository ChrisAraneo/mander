import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameLevel } from '../../types/game-level';
import { createPlayback } from './create-playback';

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
});

const STATE = createInitialState(createLevel(ROWS), 0, []);

describe('createPlayback', () => {
  it('should start at the first step and the first entry when the replay begins', () => {
    const playback = createPlayback(STATE);

    expect(playback.step).toBe(0);
    expect(playback.index).toBe(0);
  });

  it('should hold the very state it was given when the replay begins', () => {
    const playback = createPlayback(STATE);

    expect(playback.state).toBe(STATE);
    expect(playback).toEqual({ step: 0, index: 0, state: STATE });
  });
});
