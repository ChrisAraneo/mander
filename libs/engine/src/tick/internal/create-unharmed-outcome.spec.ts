import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { createUnharmedOutcome } from './create-unharmed-outcome';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

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

const LEVEL = createLevel(['........', 's.......', '########']);

const DEATHS = 2;

const createState = (): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  deaths: DEATHS,
});

describe('createUnharmedOutcome', () => {
  it('should hand the player straight back when nothing harmed them', () => {
    const state = createState();

    expect(createUnharmedOutcome(state, state.player).player).toBe(
      state.player,
    );
  });

  it('should keep the deaths of the game when nothing harmed the player', () => {
    const state = createState();

    expect(createUnharmedOutcome(state, state.player).deaths).toBe(DEATHS);
  });

  it('should keep the level going when nothing harmed the player', () => {
    const state = createState();

    expect(createUnharmedOutcome(state, state.player).status).toBe('PLAYING');
  });

  it('should leave the game it was handed untouched when nothing harmed the player', () => {
    const state = createState();

    createUnharmedOutcome(state, state.player);

    expect(state).toEqual(createState());
  });
});
