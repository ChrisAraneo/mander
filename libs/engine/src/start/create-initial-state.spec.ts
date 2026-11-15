import {
  DOUBLE_HEART,
  STAR,
  type Item,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_SPAWN,
  TWO_BULLETS,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_AMMO } from '../bullet/consts';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { BASE_HEARTS } from '../player/consts';
import type { GameLevel } from '../state/types/game-level';
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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL_ROWS = ['......', '.S..g.', '...g..', '######'];

const LEVEL = createLevel(LEVEL_ROWS);

const CARRIED_SCORE = 120;

const GRANTED_AMMO = 4;

const GRANTED_STARS = 1;

const GRANTED_HEARTS = 2;

const UPPER_GEM = { x: 4, y: 1 };

const LOWER_GEM = { x: 3, y: 2 };

const createInventory = (): Item[] => [TWO_BULLETS, STAR, DOUBLE_HEART];

describe('createInitialState', () => {
  it('should start the game in play when the level begins', () => {
    const state = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

    expect(state.status).toBe('PLAYING');
  });

  it('should start the clock and the death count at zero when the level begins', () => {
    const state = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

    expect(state.time).toBe(0);
    expect(state.deaths).toBe(0);
  });

  it('should carry the given score when a score is given', () => {
    const state = createInitialState(
      LEVEL,
      FIRST_LEVEL_INDEX,
      [],
      CARRIED_SCORE,
    );

    expect(state.score).toBe(CARRIED_SCORE);
  });

  it('should start the score at zero when no score is given', () => {
    const state = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

    expect(state.score).toBe(0);
  });

  it('should fill the ammo, stars and hearts from the inventory when the player carries items', () => {
    const state = createInitialState(
      LEVEL,
      FIRST_LEVEL_INDEX,
      createInventory(),
    );

    expect(state.ammo).toBe(BASE_AMMO + GRANTED_AMMO);
    expect(state.stars).toBe(GRANTED_STARS);
    expect(state.player.hearts.value).toBe(BASE_HEARTS + GRANTED_HEARTS);
  });

  it('should give the base ammo, no stars and the base hearts when the inventory is empty', () => {
    const state = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

    expect(state.ammo).toBe(BASE_AMMO);
    expect(state.stars).toBe(0);
    expect(state.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('should hold no buttons down when the level begins', () => {
    const state = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

    expect(state.input).toEqual({
      isLeft: false,
      isRight: false,
      isJump: false,
    });
  });

  it('should list the gems of the level when the level holds gems', () => {
    const state = createInitialState(LEVEL, FIRST_LEVEL_INDEX, []);

    expect(state.gems).toEqual([UPPER_GEM, LOWER_GEM]);
  });

  it('should leave the level and the inventory it was handed untouched when the level begins', () => {
    const level = createLevel(LEVEL_ROWS);
    const inventory = createInventory();

    createInitialState(level, FIRST_LEVEL_INDEX, inventory);

    expect(level).toEqual(createLevel(LEVEL_ROWS));
    expect(inventory).toEqual(createInventory());
  });
});
