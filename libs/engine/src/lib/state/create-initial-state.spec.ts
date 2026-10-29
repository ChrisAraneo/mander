import {
  DOUBLE_HEART,
  STAR,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_SPAWN,
  TWO_BULLETS,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_AMMO } from '../reducer/bullet/consts';
import { BASE_HEARTS } from '../reducer/player/consts';
import type { GameLevel } from '../types/game-level';
import { createInitialState } from './create-initial-state';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  S: TILE_SPAWN,
  g: TILE_GEM,
};

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['......', '.S..g.', '...g..', '######']);

const INVENTORY = [TWO_BULLETS, STAR, DOUBLE_HEART];

describe('createInitialState', () => {
  it('should start the game in play when the level begins', () => {
    const state = createInitialState(LEVEL, 0, []);

    expect(state.status).toBe('PLAYING');
  });

  it('should start the clock and the death count at zero when the level begins', () => {
    const state = createInitialState(LEVEL, 0, []);

    expect(state.time).toBe(0);
    expect(state.deaths).toBe(0);
  });

  it('should carry the given score when a score is given', () => {
    const state = createInitialState(LEVEL, 0, [], 120);

    expect(state.score).toBe(120);
  });

  it('should start the score at zero when no score is given', () => {
    const state = createInitialState(LEVEL, 0, []);

    expect(state.score).toBe(0);
  });

  it('should fill the ammo, stars and hearts from the inventory when the player carries items', () => {
    const state = createInitialState(LEVEL, 0, INVENTORY);

    expect(state.ammo).toBe(BASE_AMMO + 4);
    expect(state.stars).toBe(1);
    expect(state.player.hearts.value).toBe(BASE_HEARTS + 2);
  });

  it('should give the base ammo, no stars and the base hearts when the inventory is empty', () => {
    const state = createInitialState(LEVEL, 0, []);

    expect(state.ammo).toBe(BASE_AMMO);
    expect(state.stars).toBe(0);
    expect(state.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should hold no buttons down when the level begins', () => {
    const state = createInitialState(LEVEL, 0, []);

    expect(state.input).toEqual({
      isLeft: false,
      isRight: false,
      isJump: false,
    });
  });

  it('should list the gems of the level when the level holds gems', () => {
    const state = createInitialState(LEVEL, 0, []);

    expect(state.gems).toEqual([
      { x: 4, y: 1 },
      { x: 3, y: 2 },
    ]);
  });
});
