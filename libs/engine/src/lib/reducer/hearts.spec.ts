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
import { ceil, constant, head, map, reduce, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { HORNED_ENEMY_CHANCE } from './enemy/consts';
import { nextGameState } from './next-game-state';
import {
  BASE_HEARTS,
  HURT_FLASH_SECONDS,
  HURT_INVINCIBLE_SECONDS,
  PLAYER_HEIGHT,
} from './player/consts';
import { getSpawnPosition } from './player/get-spawn-position';

interface SpikeHit {
  heartsLeft: number;
  hit: GameState;
  recovered: GameState;
}

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

const SAFE_X = 2 * TILE_SIZE;

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
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
});

const SPAWN_X = getSpawnPosition(createTestLevel()).x;

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

const createEmberHeart = (id = 'EMBER-HEART'): Item =>
  createItem(id, { kind: 'HEART', amount: 1 });

const patchPlayerPosition = (state: GameState, left: number): GameState => ({
  ...state,
  player: {
    ...state.player,
    position: { x: left, y: SURFACE - PLAYER_HEIGHT },
  },
});

const nextSpikeHits = (state: GameState, heartsLeft: number): SpikeHit[] =>
  match(heartsLeft >= 1)
    .with(true, () =>
      pipe(
        patchPlayerPosition(state, SPIKE_X),
        nextTick,
        (hit): SpikeHit => ({
          heartsLeft,
          hit,
          recovered: nextTicks(
            patchPlayerPosition(hit, SAFE_X),
            computeTickCount(HURT_INVINCIBLE_SECONDS),
          ),
        }),
        (spikeHit) => [
          spikeHit,
          ...nextSpikeHits(spikeHit.recovered, heartsLeft - 1),
        ],
      ),
    )
    .otherwise((): SpikeHit[] => []);

describe('hearts', () => {
  it('should hold a full complement of hearts when level one starts', () => {
    expect(
      createInitialState(createTestLevel(), 0, []).player.hearts.value,
    ).toBe(BASE_HEARTS);
  });

  it('should add a heart on the spot when the player takes one from the chest', () => {
    const start = createInitialState(createTestLevel(), 0, []);

    expect(start.player.hearts.value).toBe(BASE_HEARTS);

    const stocked: GameState = {
      ...start,
      status: 'CHEST',
      level: { ...start.level, chestItems: [createEmberHeart()] },
    };
    const chosen = nextGameState(
      stocked,
      { type: 'CHOOSE_ITEM', index: 0 },
      constant(0),
    );

    expect(
      chosen.player.hearts.value,
      'the collected heart lands immediately',
    ).toBe(BASE_HEARTS + 1);
    expect(chosen.inventory).toHaveLength(1);
  });

  it('should carry the hearts over without topping them up when the next level loads', () => {
    const start = createInitialState(createTestLevel(), 0, [
      createEmberHeart(),
    ]);

    expect(start.player.hearts.value, 'base plus one collected').toBe(
      BASE_HEARTS + 1,
    );

    const weakened = {
      ...start,
      player: { ...start.player, hearts: { value: 1 } },
    };
    const loaded = nextGameState(
      weakened,
      {
        type: 'LOAD_LEVEL',
        level: createTestLevel(),
        levelIndex: 1,
      },
      constant(0),
    );

    expect(loaded.player.hearts.value, 'the next level does not refill').toBe(
      1,
    );
  });

  it('should spend one heart and respawn with the rest when the player falls into the pit', () => {
    const start = createInitialState(createTestLevel(), 0, [
      createEmberHeart('H1'),
      createEmberHeart('H2'),
    ]);

    expect(start.player.hearts.value).toBe(BASE_HEARTS + 2);

    const pitted = {
      ...start,
      player: {
        ...start.player,
        position: { x: 10 * TILE_SIZE + 5, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const respawned = nextTicks(pitted, 120);

    expect(respawned.player.position.x, 'respawned at spawn').toBe(SPAWN_X);
    expect(respawned.player.hearts.value, 'down just one heart').toBe(
      BASE_HEARTS + 1,
    );
    expect(respawned.deaths).toBe(1);
  });

  it('should shrug the hit off when the player is invincible and take it once that lapses', () => {
    const start = patchPlayerPosition(
      createInitialState(createSpikeLevel(6), 0, [createEmberHeart()]),
      SPIKE_X,
    );

    expect(start.player.hearts.value).toBe(BASE_HEARTS + 1);

    const hit = nextTick(start);

    expect(hit.player.hearts.value, 'the spike takes one heart').toBe(
      BASE_HEARTS,
    );

    const granted = hit.player.timers.invincibility;

    expect(granted).toBeGreaterThan(0);

    const bitten = nextTick(patchPlayerPosition(hit, SPIKE_X));

    expect(
      bitten.player.hearts.value,
      'a second bite bounces off the i-frames',
    ).toBe(BASE_HEARTS);
    expect(
      bitten.player.timers.invincibility,
      'and the timer keeps ticking',
    ).toBeLessThan(granted);

    const recovered = nextTicks(
      patchPlayerPosition(bitten, SAFE_X),
      computeTickCount(HURT_INVINCIBLE_SECONDS),
    );

    expect(
      recovered.player.timers.invincibility,
      'invincibility has worn off',
    ).toBe(0);
    expect(recovered.player.hearts.value, 'no damage taken while safe').toBe(
      BASE_HEARTS,
    );

    const rebitten = nextTick(patchPlayerPosition(recovered, SPIKE_X));

    expect(rebitten.player.hearts.value, 'the spike bites once more').toBe(
      BASE_HEARTS - 1,
    );
    expect(rebitten.player.timers.invincibility).toBeGreaterThan(0);
  });

  it('should soak up several hits and fall on the last when the player has a stockpile of hearts', () => {
    const start = patchPlayerPosition(
      createInitialState(createSpikeLevel(6), 0, [
        createEmberHeart('H1'),
        createEmberHeart('H2'),
      ]),
      SPIKE_X,
    );

    expect(start.player.hearts.value, 'base plus two collected').toBe(
      BASE_HEARTS + 2,
    );

    const deaths = start.deaths;
    const spikeHits = nextSpikeHits(start, BASE_HEARTS + 1);

    times(size(spikeHits), (hitIndex) =>
      expect(spikeHits[hitIndex].hit.player.hearts.value).toBe(
        spikeHits[hitIndex].heartsLeft,
      ),
    );
    times(size(spikeHits), (hitIndex) =>
      expect(
        spikeHits[hitIndex].hit.player.timers.death,
        'still alive',
      ).toBeNull(),
    );
    times(size(spikeHits), (hitIndex) =>
      expect(spikeHits[hitIndex].hit.status, 'and still playing').toBe(
        'PLAYING',
      ),
    );

    const recovered = spikeHits[size(spikeHits) - 1].recovered;

    expect(recovered.deaths, 'survived every hit').toBe(deaths);

    const fallen = nextTick(patchPlayerPosition(recovered, SPIKE_X));

    expect(fallen.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(
      fallen.player.timers.death,
      'the hit that takes the last heart is fatal',
    ).not.toBeNull();
    expect(fallen.status, 'and ends the run').toBe('GAME_OVER');
    expect(fallen.deaths, 'and counts as a death').toBe(deaths + 1);
  });

  it('should shield the player for two seconds only when a heart is lost', () => {
    const hurt = nextTick(
      patchPlayerPosition(
        createInitialState(createSpikeLevel(6), 0, []),
        SPIKE_X,
      ),
    );

    expect(hurt.player.timers.invincibility).toBe(HURT_INVINCIBLE_SECONDS);
  });

  it('should redden the player for a split second when a heart is lost', () => {
    const hurt = nextTick(
      patchPlayerPosition(
        createInitialState(createSpikeLevel(6), 0, []),
        SPIKE_X,
      ),
    );

    expect(hurt.player.timers.hurt).toBe(HURT_FLASH_SECONDS);
    expect(
      HURT_FLASH_SECONDS,
      'far shorter than the shield it rides along with',
    ).toBeLessThan(HURT_INVINCIBLE_SECONDS);

    const faded = nextTicks(
      patchPlayerPosition(hurt, SAFE_X),
      computeTickCount(HURT_FLASH_SECONDS),
    );

    expect(faded.player.timers.hurt, 'the red drains away').toBe(0);
    expect(
      faded.player.timers.invincibility,
      'while the shield is still up',
    ).toBeGreaterThan(0);
  });

  it('should leave the player their own colour when a hit glances off the invincibility', () => {
    const hurt = nextTick(
      patchPlayerPosition(
        createInitialState(createSpikeLevel(6), 0, []),
        SPIKE_X,
      ),
    );
    const faded = nextTicks(
      patchPlayerPosition(hurt, SAFE_X),
      computeTickCount(HURT_FLASH_SECONDS),
    );
    const glanced = nextTick(patchPlayerPosition(faded, SPIKE_X));

    expect(glanced.player.timers.hurt, 'no heart lost, no flash').toBe(0);
  });
});
