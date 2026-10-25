import {
  BULLET,
  DOUBLE_HEART,
  DOUBLE_STAR,
  FOUR_BULLETS,
  type Item,
  PINK_GEM,
  RED_GEM,
  STAR,
  THREE_BULLETS,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
  TRIPLE_STAR,
  TWO_BULLETS,
} from '@mander/model';
import { constant, head, map, size } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { BASE_HEARTS } from './player/consts';

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
  '##########..##################',
  '##########..##################',
  '##########..##################',
];

const createItem = (id: string, effect?: Item['effect']): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: effect ?? { kind: 'NONE' },
});

const CARDS: Item[] = [
  createItem('CARD-0'),
  createItem('CARD-1'),
  createItem('CARD-2'),
  createItem('CARD-3'),
  createItem('CARD-4'),
];

const createTestLevel = (): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});

const createChosenItemState = (item: Item): GameState =>
  pipe(
    createInitialState(createTestLevel(), 0, []),
    (state): GameState => ({
      ...state,
      status: 'CHEST',
      level: { ...state.level, chestItems: [item] },
    }),
    (state) =>
      nextGameState(state, { type: 'CHOOSE_ITEM', index: 0 }, constant(0)),
  );

describe('items', () => {
  it('should be worth two hearts when the card is a double heart', () => {
    expect(createChosenItemState(DOUBLE_HEART).player.hearts.value).toBe(
      BASE_HEARTS + 2,
    );
  });

  it('should be worth points rather than hearts when the card is a red gem', () => {
    const state = createChosenItemState(RED_GEM);

    expect(state.player.hearts.value).toBe(BASE_HEARTS);
    expect(state.score).toBe(1500);
  });

  it('should be worth a turn of invincibility for each star when the card is a single, double or triple', () => {
    expect(createChosenItemState(STAR).stars).toBe(1);
    expect(createChosenItemState(DOUBLE_STAR).stars).toBe(2);
    expect(createChosenItemState(TRIPLE_STAR).stars).toBe(3);
  });

  it('should be worth 2750 points when the card is a pink gem', () => {
    const state = createChosenItemState(PINK_GEM);

    expect(state.score).toBe(2750);
    expect(state.player.hearts.value, 'and no hearts').toBe(BASE_HEARTS);
  });

  it('should stack on top of the stars already carried when the card is a double star', () => {
    const state = createChosenItemState(STAR);

    expect(
      nextGameState(
        {
          ...state,
          status: 'CHEST',
          level: { ...state.level, chestItems: [DOUBLE_STAR] },
        },
        { type: 'CHOOSE_ITEM', index: 0 },
        constant(0),
      ).stars,
    ).toBe(3);
  });

  it('should load what its name promises when the card is a bullet card', () => {
    expect(createChosenItemState(BULLET).ammo).toBe(2);
    expect(createChosenItemState(TWO_BULLETS).ammo).toBe(4);
    expect(createChosenItemState(THREE_BULLETS).ammo).toBe(6);
    expect(createChosenItemState(FOUR_BULLETS).ammo).toBe(8);
  });

  it('should stack on top of the rounds already carried when a second bullet card is taken', () => {
    const state = createChosenItemState(TWO_BULLETS);

    expect(
      nextGameState(
        {
          ...state,
          status: 'CHEST',
          level: { ...state.level, chestItems: [THREE_BULLETS] },
        },
        { type: 'CHOOSE_ITEM', index: 0 },
        constant(0),
      ).ammo,
    ).toBe(10);
  });
});
