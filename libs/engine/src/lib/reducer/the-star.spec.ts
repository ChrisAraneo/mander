import {
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SIZE,
  TILE_SPAWN,
  TILE_SPIKE,
} from '@mander/model';
import {
  ceil,
  constant,
  head,
  map,
  omit,
  reduce,
  size,
  times,
} from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import { PLAYER_HEIGHT, STAR_INVINCIBLE_SECONDS } from './player/consts';

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

const SURFACE = 12 * TILE_SIZE;

const DELTA_SECONDS = 1 / 60;

const SPIKE_X = 6 * TILE_SIZE;

const computeSimulation = (state: GameState): Omit<GameState, 'updateTime'> =>
  omit(state, 'updateTime');

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
  shooterEnemyChance: 0,
});

const patchSpikeTile = (level: GameLevel, column: number): GameLevel => ({
  ...level,
  tiles: map(level.tiles, (row, rowIndex) =>
    map(row, (tile, columnIndex) =>
      match(rowIndex === 11 && columnIndex === column)
        .with(true, () => TILE_SPIKE)
        .otherwise(() => tile),
    ),
  ),
});

const createSpikeLevel = (column: number): GameLevel =>
  patchSpikeTile(createTestLevel(), column);

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const computeTickCount = (seconds: number): number =>
  ceil(seconds / DELTA_SECONDS) + 1;

const patchPlayerPosition = (state: GameState, left: number): GameState => ({
  ...state,
  player: {
    ...state.player,
    position: { x: left, y: SURFACE - PLAYER_HEIGHT },
  },
});

const createStar = (id = 'NIGHT-STAR', amount = 1): Item =>
  createItem(id, { kind: 'STAR', amount });

const createStateCarrying = (...items: Item[]): GameState =>
  createInitialState(createSpikeLevel(6), 0, items);

const nextStarUse = (state: GameState): GameState =>
  nextGameState(state, { type: 'USE_STAR' }, constant(0));

describe('the star', () => {
  it('should buy three seconds of invincibility when the player spends a star', () => {
    const state = nextStarUse(createStateCarrying(createStar()));

    expect(state.player.timers.invincibility).toBe(STAR_INVINCIBLE_SECONDS);
    expect(state.stars, 'and the star is spent').toBe(0);
  });

  it('should burn through the pack one star at a time when the player spends them', () => {
    const state = nextStarUse(
      createStateCarrying(createStar('FIRST'), createStar('SECOND')),
    );

    expect(state.stars).toBe(1);
    expect(nextStarUse(state).stars, 'and then the last of them').toBe(0);
  });

  it('should count what the card is worth rather than how many cards there are when the pack is loaded', () => {
    expect(createStateCarrying(createStar('TWIN-STAR', 2)).stars).toBe(2);
  });

  it('should do nothing when the pack is empty', () => {
    const state = createStateCarrying();

    expect(computeSimulation(nextStarUse(state))).toEqual(
      computeSimulation(state),
    );
  });

  it('should keep the cards on the record when they have been spent', () => {
    const trinket = createItem('KEEPSAKE');
    const state = nextStarUse(createStateCarrying(trinket, createStar()));

    expect(state.inventory).toEqual([trinket, createStar()]);
    expect(state.stars, 'though the star itself is gone').toBe(0);
  });

  it('should walk the player through spikes unharmed when the star still lasts', () => {
    const shielded = nextStarUse(createStateCarrying(createStar()));
    const hearts = shielded.player.hearts.value;
    const walked = nextTicks(
      patchPlayerPosition(shielded, SPIKE_X),
      computeTickCount(1),
    );

    expect(walked.player.hearts.value, 'the spikes cannot bite').toBe(hearts);
    expect(walked.player.timers.death, 'and the player lives on').toBeNull();
  });

  it('should leave the player mortal again when its three seconds have run out', () => {
    const shielded = nextStarUse(createStateCarrying(createStar()));
    const hearts = shielded.player.hearts.value;
    const faded = nextTicks(
      shielded,
      computeTickCount(STAR_INVINCIBLE_SECONDS),
    );

    expect(faded.player.timers.invincibility, 'the glow fades').toBe(0);

    const bitten = nextTick(patchPlayerPosition(faded, SPIKE_X));

    expect(bitten.player.hearts.value, 'and the spike bites again').toBe(
      hearts - 1,
    );
  });

  it('should light the player up when the star shield holds', () => {
    const state = nextStarUse(createStateCarrying(createStar()));

    expect(state.player.timers.star).toBe(STAR_INVINCIBLE_SECONDS);
    expect(
      nextTicks(state, computeTickCount(STAR_INVINCIBLE_SECONDS)).player.timers
        .star,
      'and puts the glow out when it lapses',
    ).toBe(0);
  });

  it('should leave the player dark when a heart is merely lost', () => {
    const hurt = nextTick(
      patchPlayerPosition(createStateCarrying(createStar()), SPIKE_X),
    );

    expect(
      hurt.player.timers.invincibility,
      'the heart-loss shield is up',
    ).toBeGreaterThan(0);
    expect(hurt.player.timers.star, 'but nothing is glowing').toBe(0);
  });

  it('should top the shield back up to a full three seconds when a star is spent on a fading one', () => {
    const hurt = nextTick(
      patchPlayerPosition(createStateCarrying(createStar()), SPIKE_X),
    );

    expect(hurt.player.timers.invincibility).toBeLessThan(
      STAR_INVINCIBLE_SECONDS,
    );

    expect(nextStarUse(hurt).player.timers.invincibility).toBe(
      STAR_INVINCIBLE_SECONDS,
    );
  });

  it('should keep the star unspent when the chest is still open', () => {
    const state: GameState = {
      ...createStateCarrying(createStar()),
      status: 'CHEST',
    };

    expect(nextStarUse(state).stars).toBe(1);
  });

  it('should carry the stars left over when the next level loads', () => {
    const state = nextGameState(
      nextStarUse(createStateCarrying(createStar('TWIN-STAR', 2))),
      {
        type: 'LOAD_LEVEL',
        level: createTestLevel(),
        levelIndex: 1,
      },
      constant(0),
    );

    expect(state.stars).toBe(1);
  });
});
