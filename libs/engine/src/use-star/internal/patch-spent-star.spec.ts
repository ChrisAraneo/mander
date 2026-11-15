import {
  STAR,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { STAR_INVINCIBLE_SECONDS } from '../../player/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchSpentStar } from './patch-spent-star';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
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

const LEVEL = createLevel(['.....', '.S...', '#####']);

const createState = (): GameState =>
  createInitialState(LEVEL, FIRST_LEVEL_INDEX, [STAR, STAR]);

describe('patchSpentStar', () => {
  it('should use up one star and shield the player when the player spends a star', () => {
    const state = createState();

    const patched = patchSpentStar(state);

    expect(patched).toEqual({
      ...state,
      stars: 1,
      player: {
        ...state.player,
        timers: {
          ...state.player.timers,
          invincibility: STAR_INVINCIBLE_SECONDS,
          star: STAR_INVINCIBLE_SECONDS,
        },
      },
    });
  });

  it('should leave the game it was handed untouched when the player spends a star', () => {
    const state = createState();

    patchSpentStar(state);

    expect(state).toEqual(createState());
  });
});
