import type { Point } from '@mander/utils';
import { map, omit, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Action } from '../actions/actions';
import {
  CANNON_RANGE_TILES,
  CANNON_RELOAD_SECONDS,
  CANNONBALL_SIZE,
  CANNONBALL_SPEED,
} from './cannon/consts';
import {
  ENEMY_DEATH_SECONDS,
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_JUMP_VELOCITY,
} from './enemy/consts';
import { createBasePlayerVelocity } from './player/create-base-player-velocity';
import {
  BASE_HEARTS,
  HURT_FLASH_SECONDS,
  HURT_INVINCIBLE_SECONDS,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  STAR_INVINCIBLE_SECONDS,
  STOMP_BOUNCE_VELOCITY,
} from './player/consts';
import {
  GEM_SCORE,
  LEVEL_SCORE_BASE,
  LEVEL_SCORE_MIN,
  LEVEL_SCORE_PER_SECOND,
} from './score/consts';
import { isOverlappingSpike } from './spike/is-overlapping-spike';
import { getSpawnPosition } from './player/get-spawn-position';
import type { GameLevel } from '../types/game-level';
import { createInitialState } from '../state/create-initial-state';
import type { GameState } from '../state/types/game-state';
import { reduce } from './reduce';
import { computeTotalTime } from './score/compute-total-time';
import {
  BOOTS_OF_CLOUDS,
  BULLET,
  DOUBLE_HEART,
  DOUBLE_STAR,
  type EnemyKind,
  FOUR_BULLETS,
  type Item,
  type Level,
  MAX_JUMP_TILES,
  PINK_GEM,
  RED_GEM,
  STAR,
  THREE_BULLETS,
  type Tile,
  TILE_AIR,
  TILE_CANNON,
  TILE_CHEST,
  TILE_GEM,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SIZE,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
  TITANIUM_HELMET,
  TRIPLE_STAR,
  TWO_BULLETS,
  VAMPIRE_SLAYER_BULLET_RAIN,
} from '@mander/model';

const simulation = (state: GameState): Omit<GameState, 'updateTime'> =>
  omit(state, 'updateTime');

const WIDTH = 30;
const HEIGHT = 15;
const SURFACE = 12 * TILE_SIZE;

const item = (id: string, effect?: Item['effect']): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: effect ?? { kind: 'NONE' },
});

const CARDS: Item[] = [
  item('CARD-0'),
  item('CARD-1'),
  item('CARD-2'),
  item('CARD-3'),
  item('CARD-4'),
];

const testLevel = (enemies: Point[] = []): GameLevel => {
  const tiles: Tile[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    const fillTile: Tile = y >= 12 ? TILE_DIRT : TILE_AIR;
    const row: Tile[] = Array.from({ length: WIDTH }, () => fillTile);
    row[0] = TILE_DIRT;
    row[WIDTH - 1] = TILE_DIRT;
    tiles.push(row);
  }
  for (let y = 12; y < HEIGHT; y++) {
    tiles[y][10] = TILE_AIR;
    tiles[y][11] = TILE_AIR;
  }
  const groundRow = SURFACE / TILE_SIZE;
  tiles[groundRow - 1][2] = TILE_SPAWN;
  tiles[groundRow - 2][2] = TILE_SPAWN;
  tiles[groundRow - 1][15] = TILE_KEY;
  tiles[groundRow - 1][20] = TILE_CHEST;
  tiles[groundRow - 1][25] = TILE_PORTAL;
  tiles[groundRow - 2][25] = TILE_PORTAL;
  for (const spawn of enemies) tiles[spawn.y][spawn.x] = TILE_ENEMY;
  return {
    seed: 'TEST',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    chestItems: CARDS,
    hornedEnemyChance: HORNED_ENEMY_CHANCE,
  };
};

const SPAWN_X = getSpawnPosition(testLevel()).x;

const DELTA_SECONDS = 1 / 60;

const act = (state: GameState, action: Action) => reduce(state, action);
const tick = (state: GameState) => reduce(state, { type: 'TICK' });

const tickN = (state: GameState, n: number): GameState => {
  let next = state;
  for (let i = 0; i < n; i++) next = tick(next);
  return next;
};

const ticksFor = (seconds: number): number =>
  Math.ceil(seconds / DELTA_SECONDS) + 1;

const settledAt = (x: number, inventory: Item[] = []): GameState => {
  const state = createInitialState(testLevel(), 0, inventory);
  state.player.position.x = x;
  state.player.position.y = SURFACE - PLAYER_HEIGHT;
  return tick(state);
};

const jumpApex = (start: GameState, holdTicks: number): number => {
  let state = act(start, { type: 'JUMP_START' });
  let apex = state.player.position.y;
  for (let i = 0; i < 300; i++) {
    if (i === holdTicks) state = act(state, { type: 'JUMP_STOP' });
    state = tick(state);
    apex = Math.min(apex, state.player.position.y);
    if (state.player.statuses.isGrounded && i > 2) break;
  }
  return apex;
};

describe('movement actions', () => {
  it('should apply gravity when the player is off the ground', () => {
    let state = createInitialState(testLevel(), 0, []);
    expect(state.player.statuses.isGrounded).toBe(false);
    state = tickN(state, 60);
    expect(state.player.statuses.isGrounded).toBe(true);
    expect(state.player.position.y).toBe(SURFACE - PLAYER_HEIGHT);
    expect(state.player.velocity.y.current).toBe(0);
  });

  it('should move the player and stop them again when right is pressed and released', () => {
    const start = settledAt(3 * TILE_SIZE);
    let state = act(start, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, 10);
    expect(state.player.position.x).toBeGreaterThan(start.player.position.x);
    expect(state.player.statuses.isFacingRight).toBe(true);

    const movedX = state.player.position.x;
    state = act(state, { type: 'MOVE_RIGHT_STOP' });
    state = tickN(state, 5);
    expect(state.player.position.x).toBe(movedX);
  });

  it('should stop the player when a wall stands to their left', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'MOVE_LEFT_START' });
    state = tickN(state, 600);
    expect(state.player.position.x).toBe(TILE_SIZE);
    expect(state.player.velocity.x.current).toBe(0);
    expect(state.player.statuses.isFacingRight).toBe(false);
  });

  it('should hold the player back when the ceiling is one tile above the ground', () => {
    const level = testLevel();
    level.tiles[10][6] = TILE_DIRT;
    let state = createInitialState(level, 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 3 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    state = act(state, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, 120);
    expect(state.player.position.x + PLAYER_WIDTH).toBeLessThanOrEqual(
      6 * TILE_SIZE,
    );
  });

  it('should respawn the player, count a death and spend a heart when they fall into the pit', () => {
    const start = settledAt(8 * TILE_SIZE);
    start.player.position.x = 10 * TILE_SIZE + 5;
    const state = tickN(start, 120);
    expect(state.deaths).toBe(1);
    expect(state.player.position.x).toBe(SPAWN_X);
    expect(state.player.hearts.value, 'the fall cost a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(state.status, 'with hearts to spare the run goes on').toBe(
      'PLAYING',
    );
  });

  it('should reset the player position but keep the key and inventory when the player respawns', () => {
    let state = settledAt(15 * TILE_SIZE, [item('EXTRA')]);
    state = tickN(state, 2);
    expect(state.hasKey).toBe(true);
    state = act(state, { type: 'RESPAWN' });
    expect(state.player.position.x).toBe(SPAWN_X);
    expect(state.hasKey).toBe(true);
    expect(state.inventory).toHaveLength(1);
  });
});

describe('jumping', () => {
  it('should jump only when the player is grounded', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    expect(state.player.velocity.y.current).toBeLessThan(0);
    expect(state.player.statuses.isGrounded).toBe(false);

    state = act(state, { type: 'JUMP_STOP' });
    const risingVy = state.player.velocity.y.current;
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    expect(state.player.velocity.y.current).toBeGreaterThan(risingVy);
    expect(state.player.velocity.y.current).toBeLessThan(0);
  });

  it('should ignore the jump when the key is only being held down', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    const rising = state.player.velocity.y.current;
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    expect(state.player.velocity.y.current).toBeGreaterThan(rising);
    expect(state.player.velocity.y.current).toBeLessThan(0);
  });

  it('should jump again on landing when the jump button stays held', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'JUMP_START' });
    let hasLanded = false;
    let hasRejumped = false;
    for (let i = 0; i < 200; i++) {
      state = tick(state);
      if (state.player.statuses.isGrounded) hasLanded = true;
      else if (hasLanded && state.player.velocity.y.current < 0) {
        hasRejumped = true;
        break;
      }
    }
    expect(hasLanded).toBe(true);
    expect(hasRejumped, 'a held jump bounces again after touching down').toBe(
      true,
    );
  });

  it('should jump lower when the press is a short tap rather than a held one', () => {
    const start = settledAt(3 * TILE_SIZE);
    const tapApex = jumpApex(start, 3);
    const heldApex = jumpApex(start, 100);
    const surfaceY = SURFACE - PLAYER_HEIGHT;
    expect(tapApex).toBeLessThan(surfaceY);
    expect(heldApex).toBeLessThan(surfaceY);
    expect(surfaceY - heldApex).toBeGreaterThan((surfaceY - tapApex) * 1.5);
  });

  it('should clear the tallest climb the generator hands out and no more when the player jumps', () => {
    const rise =
      SURFACE - PLAYER_HEIGHT - jumpApex(settledAt(3 * TILE_SIZE), 100);
    expect(rise).toBeGreaterThan((MAX_JUMP_TILES - 1) * TILE_SIZE);
    expect(rise).toBeLessThan(MAX_JUMP_TILES * TILE_SIZE);
  });
});

describe('key and chest', () => {
  it('should collect the key when the player walks over it', () => {
    let state = settledAt(13 * TILE_SIZE);
    expect(state.hasKey).toBe(false);
    state = act(state, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, 120);
    expect(state.hasKey).toBe(true);
  });

  it('should keep the chest locked when the player has no key', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    expect(state.isNearChest).toBe(true);
    expect(state.hasKey).toBe(false);
    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('PLAYING');
    expect(state.inventory).toHaveLength(0);
  });

  it('should open the chest and take one card when the player has the key', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('CHEST');

    state = act(state, { type: 'MOVE_RIGHT_START' });
    const frozen = tick(state);
    expect(frozen.player).toEqual(state.player);
    expect(frozen.input.isRight).toBe(true);
    state = act(state, { type: 'MOVE_RIGHT_STOP' });

    state = act(state, { type: 'CHOOSE_ITEM', index: 1 });
    expect(state.status).toBe('PLAYING');
    expect(state.isChestOpened).toBe(true);
    expect(state.inventory.map((i) => i.id)).toEqual(['CARD-1']);

    state = tick(state);
    expect(state.isNearChest).toBe(false);
    const again = act(state, { type: 'INTERACT' });
    expect(again.status).toBe('PLAYING');
    expect(again.inventory).toHaveLength(1);
  });

  it('should leave the chest alone when the player interacts with it already open', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('CHEST');

    const again = act(state, { type: 'INTERACT' });
    expect(again.status).toBe('CHEST');
    expect(again.isChestOpened).toBe(false);
    expect(again.inventory).toHaveLength(0);
  });

  it('should take only the card the player named when several are offered', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });

    const chosen = act(state, { type: 'CHOOSE_ITEM', index: 2 });
    expect(chosen.status).toBe('PLAYING');
    expect(chosen.inventory.map((i) => i.id)).toEqual(['CARD-2']);
  });

  it('should leave the chest unopened when the player closes it', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    state = act(state, { type: 'CLOSE' });
    expect(state.status).toBe('PLAYING');
    expect(state.isChestOpened).toBe(false);
    expect(state.inventory).toHaveLength(0);
    state = tick(state);
    expect(state.isNearChest).toBe(true);
  });

  it('should ignore the choice when the index is not one of the cards', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    const unchanged = act(state, { type: 'CHOOSE_ITEM', index: 99 });
    expect(simulation(unchanged)).toEqual(simulation(state));
  });
});

describe('portal and level loading', () => {
  it('should complete the level when the player enters the portal without the key', () => {
    let state = settledAt(25 * TILE_SIZE - 10);
    expect(state.isNearPortal).toBe(true);
    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('COMPLETE');
    expect(simulation(tick(state))).toEqual(simulation(state));
  });

  it('should wind the clock back but keep the inventory when the next level loads', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    state = act(state, { type: 'CHOOSE_ITEM', index: 3 });
    const carried = state.time;
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: testLevel(),
      levelIndex: 1,
    });

    expect(state.levelIndex).toBe(1);
    expect(state.status).toBe('PLAYING');
    expect(state.hasKey).toBe(false);
    expect(state.isChestOpened).toBe(false);
    expect(carried, 'the first level put time on the clock').toBeGreaterThan(0);
    expect(state.time, 'which the next level winds back').toBe(0);
    expect(state.player.position.x).toBe(SPAWN_X);
    expect(state.inventory.map((i) => i.id)).toEqual(['CARD-3']);
  });
});

describe('enemies', () => {
  const enemySpawn: Point = { x: 5, y: 11 };
  const floorEnemyY = SURFACE - ENEMY_HEIGHT;

  const withEnemy = (): GameState => {
    const state = createInitialState(testLevel([enemySpawn]), 0, []);
    return {
      ...state,
      enemies: state.enemies.map((enemy) => ({
        ...enemy,
        kind: 'HOPPING' as EnemyKind,
      })),
    };
  };

  const flyingEnemySpawn: Point = { x: 5, y: 5 };
  const withFlyingEnemy = (): GameState =>
    createInitialState(testLevel([flyingEnemySpawn]), 0, []);

  it('should turn the enemy back when it paces into a wall or a platform edge', () => {
    let state = withEnemy();
    const facings = new Set<boolean>();
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < 500; i++) {
      state = tick(state);
      const enemy = state.enemies[0];
      expect(enemy.statuses.isGrounded, `isGrounded at tick ${i}`).toBe(true);
      expect(enemy.position.y, `on the floor at tick ${i}`).toBe(floorEnemyY);
      facings.add(enemy.statuses.isFacingRight);
      minX = Math.min(minX, enemy.position.x);
      maxX = Math.max(maxX, enemy.position.x);
    }
    expect(
      facings.has(true) && facings.has(false),
      'turned around both ways',
    ).toBe(true);
    expect(maxX - minX, 'actually paced a distance').toBeGreaterThan(TILE_SIZE);
  });

  it('should hop, and lower than the player jumps, when the player is overhead', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    expect(enemy.statuses.isGrounded).toBe(true);

    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: enemy.position.x, y: enemy.position.y - 3 * TILE_SIZE },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 0 },
        },
      },
    };
    state = tick(state);
    expect(
      state.enemies[0].velocity.y.current,
      'the enemy launched upward',
    ).toBeLessThan(0);

    expect(ENEMY_JUMP_VELOCITY).toBeLessThan(createBasePlayerVelocity().y.max);
  });

  it('should ignore the player when they stand alongside it rather than overhead', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: enemy.position.x + ENEMY_WIDTH, y: enemy.position.y },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 0 },
        },
      },
    };
    state = tick(state);
    expect(
      state.enemies[0].statuses.isGrounded,
      'did not hop from mere proximity',
    ).toBe(true);
  });

  it('should be gone for good when the enemy drops into the pit', () => {
    let state = withEnemy();
    state = tickN(state, 5);
    expect(
      state.enemies,
      'the enemy is on the floor to begin with',
    ).toHaveLength(1);

    state = {
      ...state,
      enemies: [
        {
          ...state.enemies[0],
          position: { x: 10 * TILE_SIZE + 4, y: floorEnemyY },
          statuses: { ...state.enemies[0].statuses, isGrounded: false },
        },
      ],
    };

    state = tickN(state, 300);
    expect(
      state.enemies,
      'it fell out of the world and stayed out',
    ).toHaveLength(0);
  });

  it('should reset every enemy to its own spawn point when the player respawns', () => {
    let state = withEnemy();
    const enemySpawnPos = state.enemies[0].spawn;
    state = tickN(state, 5);
    expect(
      state.enemies[0].position.x,
      'paced away from its spawn by now',
    ).not.toBe(enemySpawnPos.x);

    state = act(state, { type: 'RESPAWN' });
    expect(state.player.position.x, 'the player went back to spawn').toBe(
      SPAWN_X,
    );
    expect(state.enemies, 'still exactly one enemy').toHaveLength(1);
    expect(
      state.enemies[0].position,
      'and it is back at its own spawn point too',
    ).toEqual(enemySpawnPos);
  });

  it('should respawn every enemy too when the player auto-respawns after a pit fall', () => {
    let state = withEnemy();
    const enemySpawnPos = state.enemies[0].spawn;
    state = tickN(state, 5);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 10 * TILE_SIZE + 5, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    for (let i = 0; i < 300 && state.player.timers.death === null; i++) {
      state = tick(state);
    }
    expect(
      state.player.timers.death,
      'the fall started the death throes',
    ).not.toBeNull();
    for (let i = 0; i < 300 && state.player.timers.death !== null; i++) {
      state = tick(state);
    }
    expect(state.player.timers.death, 'and the respawn completed').toBeNull();
    expect(state.player.position.x, 'respawned at spawn').toBe(SPAWN_X);
    expect(state.enemies, 'still exactly one enemy').toHaveLength(1);
    expect(
      state.enemies[0].position,
      'the enemy reset to its own spawn point too',
    ).toEqual(enemySpawnPos);
  });

  it('should spawn the enemies of the new level when the next level loads', () => {
    let state = withEnemy();
    expect(state.enemies).toHaveLength(1);
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: testLevel([enemySpawn, { x: 7, y: 11 }]),
      levelIndex: 1,
    });
    expect(state.enemies).toHaveLength(2);
  });

  const withSpike = (col: number, enemies: Point[] = []): GameLevel => {
    const level = testLevel(enemies);
    level.tiles[11][col] = TILE_SPIKE;
    return level;
  };

  it('should cost a heart and grant invincibility rather than kill when the player walks into a spike', () => {
    let state = createInitialState(withSpike(6), 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 6 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    expect(state.player.hearts.value).toBe(BASE_HEARTS);
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'the prick drains a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(
      state.player.timers.invincibility,
      'and buys a moment of mercy',
    ).toBeGreaterThan(0);
    expect(state.player.timers.death, 'but stays on their feet').toBeNull();
    expect(
      state.player.position.x,
      'rooted in place — no knockback, no respawn',
    ).toBe(6 * TILE_SIZE);
    expect(state.deaths, 'a survived hit is not a death').toBe(before);
  });

  it('should end the run rather than respawn when a spike takes the last heart', () => {
    let state = createInitialState(withSpike(6), 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 6 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
        hearts: { value: 1 },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(
      state.player.timers.death,
      'with nothing in reserve the prick is lethal',
    ).not.toBeNull();
    expect(state.status, 'and the run is over').toBe('GAME_OVER');
    expect(state.deaths, 'and it counts as a death').toBe(before + 1);

    const later = tickN(state, 120);
    expect(later.player.position.x, 'there is no respawn out of it').not.toBe(
      SPAWN_X,
    );
    expect(simulation(later), 'a finished run does not move on').toEqual(
      simulation(state),
    );
  });

  it('should ignore the input when the player is dying from a pit fall', () => {
    let state = settledAt(8 * TILE_SIZE);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { ...state.player.position, x: 10 * TILE_SIZE + 5 },
      },
    };
    for (let i = 0; i < 300 && state.player.timers.death === null; i++) {
      state = tick(state);
    }
    expect(
      state.player.timers.death,
      'the fall started the death throes',
    ).not.toBeNull();
    const deaths = state.deaths;

    state = act(state, { type: 'MOVE_RIGHT_START' });
    const deadX = state.player.position.x;
    state = tickN(state, 4);
    expect(state.player.position.x, 'the corpse does not walk').toBe(deadX);
    expect(state.deaths, 'no second death mid-fall').toBe(deaths);

    state = act(state, { type: 'JUMP_START' });
    expect(state.player.statuses.isJumpQueued).toBe(false);
  });

  it('should turn the enemy back and keep it alive when it paces into a spike', () => {
    const initial = createInitialState(withSpike(9, [enemySpawn]), 0, []);
    let state: GameState = {
      ...initial,
      enemies: initial.enemies.map((enemy) => ({
        ...enemy,
        kind: 'HOPPING' as EnemyKind,
      })),
    };
    let maxRight = 0;
    for (let i = 0; i < 400; i++) {
      state = tick(state);
      expect(state.enemies, `alive at tick ${i}`).toHaveLength(1);
      maxRight = Math.max(maxRight, state.enemies[0].position.x + ENEMY_WIDTH);
    }
    expect(maxRight, 'paced toward the spike').toBeGreaterThan(7 * TILE_SIZE);
    expect(maxRight, 'never reached the spike column').toBeLessThanOrEqual(
      9 * TILE_SIZE,
    );
  });

  it('should kill the enemy and clear it once it fades when it ends up on a spike', () => {
    let state = createInitialState(withSpike(5, [{ x: 7, y: 11 }]), 0, []);
    expect(state.enemies).toHaveLength(1);
    state = {
      ...state,
      enemies: [
        {
          ...state.enemies[0],
          position: {
            x: 5 * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2,
            y: floorEnemyY,
          },
        },
      ],
    };
    state = tick(state);
    expect(state.enemies, 'lingers while it fades').toHaveLength(1);
    expect(state.enemies[0].timers.death).toBe(0);
    expect(state.enemies[0].velocity.x.current, 'stops dead').toBe(0);
    expect(
      state.enemies[0].position.y,
      'already on solid ground — nowhere to fall',
    ).toBe(floorEnemyY);

    state = tickN(state, ticksFor(ENEMY_DEATH_SECONDS));
    expect(state.enemies).toHaveLength(0);
  });

  it('should keep the enemy falling when it dies in mid-air', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      enemies: [
        {
          ...enemy,
          position: { ...enemy.position, y: enemy.position.y - 3 * TILE_SIZE },
          velocity: {
            ...enemy.velocity,
            y: { ...enemy.velocity.y, current: 0 },
          },
          statuses: { ...enemy.statuses, isGrounded: false },
          timers: { death: 0 },
        },
      ],
    };
    const startY = state.enemies[0].position.y;
    state = tick(state);
    expect(
      state.enemies[0].position.y,
      'the corpse keeps falling instead of hanging frozen in the air',
    ).toBeGreaterThan(startY);
    expect(
      state.enemies[0].velocity.y.current,
      'gravity is still acting on it',
    ).toBeGreaterThan(0);
  });

  it('should let the player through unharmed when the enemy is dying', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];

    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 0 },
        },
      },
      enemies: [{ ...enemy, timers: { ...enemy.timers, death: 0 } }],
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.deaths, 'a fading enemy has no bite left').toBe(before);
    expect(state.player.timers.death).toBeNull();
  });

  it('should cost a heart and leave the player standing but invincible when an enemy touches them', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 0 },
        },
      },
    };
    const before = state.deaths;
    const restingX = enemy.position.x;
    state = tick(state);
    expect(state.player.hearts.value, 'the bump drains a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(state.player.timers.invincibility).toBeGreaterThan(0);
    expect(state.player.timers.death, 'no death, no respawn').toBeNull();
    expect(state.player.position.x, 'and no knockback').toBe(restingX);
    expect(state.deaths).toBe(before);
  });

  it('should end the run when an enemy takes the last heart', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 0 },
        },
        hearts: { value: 1 },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(
      state.player.timers.death,
      'with nothing in reserve the bump is lethal',
    ).not.toBeNull();
    expect(state.status, 'and the run is over').toBe('GAME_OVER');
    expect(state.deaths).toBe(before + 1);
    expect(
      simulation(tickN(state, 120)),
      'a finished run does not move on',
    ).toEqual(simulation(state));
  });

  it('should leave the player unhurt when the pit keeps them apart from the enemy', () => {
    let state = withEnemy();
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 15 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const deaths = state.deaths;
    for (let i = 0; i < 120; i++) state = tick(state);
    expect(state.deaths).toBe(deaths);
  });

  it('should spare the player when they only graze the enemy and the drawn bodies never touch', () => {
    let state = withEnemy();
    const enemyFloorY = SURFACE - ENEMY_HEIGHT;
    const px = 6 * TILE_SIZE;
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: px, y: SURFACE - PLAYER_HEIGHT },
        velocity: {
          x: { ...state.player.velocity.x, current: 0 },
          y: { ...state.player.velocity.y, current: 0 },
        },
        statuses: { ...state.player.statuses, isGrounded: true },
      },
      enemies: [
        {
          kind: 'HOPPING',
          position: { x: px + 17, y: enemyFloorY },
          velocity: {
            x: { current: 0, max: ENEMY_MOVE_SPEED },
            y: { current: 0, max: ENEMY_JUMP_VELOCITY },
          },
          timers: { death: null },
          spawn: { x: px + 17, y: enemyFloorY },
          statuses: { isFacingRight: true, isGrounded: true },
        },
      ],
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.deaths, 'grazing the bounding boxes is not lethal').toBe(
      before,
    );
  });

  it('should kill the enemy and cost no heart when the player lands on it from above at terminal velocity', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: {
        ...state.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + 1 - PLAYER_HEIGHT,
        },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 1000 },
        },
        statuses: { ...state.player.statuses, isGrounded: false },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(
      state.enemies[0].timers.death,
      'still a clean stomp, even landing well past the head',
    ).toBe(0);
    expect(state.player.hearts.value, 'no damage from a clean stomp').toBe(
      BASE_HEARTS,
    );
    expect(state.player.velocity.y.current, 'the player bounces back up').toBe(
      -STOMP_BOUNCE_VELOCITY,
    );
    expect(state.deaths).toBe(before);
  });

  it('should clear the stomped enemy away when its death fade finishes', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: {
        ...state.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + 1 - PLAYER_HEIGHT,
        },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 1000 },
        },
        statuses: { ...state.player.statuses, isGrounded: false },
      },
    };
    state = tick(state);
    expect(state.enemies, 'lingers while it fades').toHaveLength(1);
    state = tickN(state, ticksFor(ENEMY_DEATH_SECONDS));
    expect(state.enemies, 'gone once fully faded').toHaveLength(0);
  });

  it('should launch a full jump rather than the small bounce when the player stomps an enemy with jump held', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = act(state, { type: 'JUMP_START' });
    state = {
      ...state,
      player: {
        ...state.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + 1 - PLAYER_HEIGHT,
        },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 1000 },
        },
        statuses: { ...state.player.statuses, isGrounded: false },
      },
    };
    state = tick(state);
    expect(state.enemies[0].timers.death, 'still a clean stomp').toBe(0);
    expect(state.player.hearts.value, 'no damage from a clean stomp').toBe(
      BASE_HEARTS,
    );
    expect(
      state.player.velocity.y.current,
      'a held jump button turns the bounce into a full jump',
    ).toBe(-state.player.velocity.y.max);
    expect(
      -state.player.velocity.y.current,
      'stronger than the ordinary stomp bounce',
    ).toBeGreaterThan(STOMP_BOUNCE_VELOCITY);
  });

  it('should kill the enemy and spare the heart when it hops up into the falling player', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      enemies: [
        {
          ...enemy,
          position: { x: enemy.position.x, y: enemy.position.y - TILE_SIZE },
          velocity: {
            x: { current: 0, max: ENEMY_MOVE_SPEED },
            y: { current: -ENEMY_JUMP_VELOCITY, max: ENEMY_JUMP_VELOCITY },
          },
          statuses: { ...enemy.statuses, isGrounded: false },
        },
      ],
      player: {
        ...state.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y - TILE_SIZE + 9 - PLAYER_HEIGHT,
        },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 400 },
        },
        statuses: { ...state.player.statuses, isGrounded: false },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(
      state.enemies[0].timers.death,
      'meeting it head-on on the way down is still a stomp',
    ).toBe(0);
    expect(state.player.hearts.value, 'and costs nothing').toBe(BASE_HEARTS);
    expect(state.player.velocity.y.current, 'the player bounces back up').toBe(
      -STOMP_BOUNCE_VELOCITY,
    );
    expect(state.deaths).toBe(before);
  });

  it('should kill the enemy when the player only clips its edge on the way down', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: {
        ...state.player,
        position: {
          x: enemy.position.x - 17,
          y: enemy.position.y + 1 - PLAYER_HEIGHT,
        },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 400 },
        },
        statuses: { ...state.player.statuses, isGrounded: false },
      },
    };
    state = tick(state);
    expect(
      state.enemies[0].timers.death,
      'clipping the head with the edge of the boot counts',
    ).toBe(0);
    expect(state.player.hearts.value, 'no damage from a clipped stomp').toBe(
      BASE_HEARTS,
    );
  });

  it('should cost a heart rather than count as a stomp when the enemy lands on the player from above', () => {
    let state = withEnemy();
    const player = {
      ...state.player,
      position: { x: 6 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      velocity: {
        x: { ...state.player.velocity.x, current: 0 },
        y: { ...state.player.velocity.y, current: 0 },
      },
      statuses: { ...state.player.statuses, isGrounded: true },
    };
    state = {
      ...state,
      player,
      enemies: [
        {
          ...state.enemies[0],
          position: { x: player.position.x, y: player.position.y - 10 },
          velocity: {
            x: { current: 0, max: ENEMY_MOVE_SPEED },
            y: { current: 200, max: ENEMY_JUMP_VELOCITY },
          },
          statuses: { ...state.enemies[0].statuses, isGrounded: false },
        },
      ],
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'a falling enemy still hurts').toBe(
      BASE_HEARTS - 1,
    );
    expect(
      state.enemies[0].timers.death,
      'the enemy dealt the blow, not the other way round',
    ).toBeNull();
    expect(state.deaths).toBe(before);
  });

  it('should die and cost a heart when the horned enemy is touched from the side', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      enemies: [{ ...enemy, kind: 'HORNED' }],
      player: {
        ...state.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 0 },
        },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'the trade costs a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(state.enemies[0].timers.death, 'and the horn breaks').toBe(0);
    expect(state.deaths).toBe(before);
  });

  it('should die and still cost a heart when the horned enemy is stomped from above', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      enemies: [{ ...enemy, kind: 'HORNED' }],
      player: {
        ...state.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + 1 - PLAYER_HEIGHT,
        },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 1000 },
        },
        statuses: { ...state.player.statuses, isGrounded: false },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.enemies[0].timers.death, 'the hit kills it too').toBe(0);
    expect(state.player.hearts.value, 'landing on it still hurts').toBe(
      BASE_HEARTS - 1,
    );
    expect(
      state.player.velocity.y.current,
      'no stomp bounce for a horned enemy',
    ).toBeGreaterThan(0);
    expect(state.deaths).toBe(before);
  });

  it('should spare the horned enemy when the player is still invincible', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      enemies: [{ ...enemy, kind: 'HORNED' }],
      player: {
        ...state.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 0 },
        },
        timers: {
          ...state.player.timers,
          invincibility: HURT_INVINCIBLE_SECONDS,
        },
      },
    };
    state = tick(state);
    expect(
      state.enemies[0].timers.death,
      'an invincible player cannot gore it',
    ).toBeNull();
    expect(state.player.hearts.value, 'and takes no further damage').toBe(
      BASE_HEARTS,
    );
  });

  it('should hop 30% lower than a hopping enemy when the enemy is horned', () => {
    const hopVelocity = (kind: EnemyKind, jumpMax: number): number => {
      let state = withEnemy();
      for (let i = 0; i < 10; i++) state = tick(state);
      const enemy = state.enemies[0];
      state = {
        ...state,
        enemies: [
          {
            ...enemy,
            kind,
            velocity: { ...enemy.velocity, y: { current: 0, max: jumpMax } },
          },
        ],
        player: {
          ...state.player,
          position: {
            x: enemy.position.x,
            y: enemy.position.y - 3 * TILE_SIZE,
          },
          velocity: {
            ...state.player.velocity,
            y: { ...state.player.velocity.y, current: 0 },
          },
        },
      };
      state = tick(state);
      return state.enemies[0].velocity.y.current;
    };

    const hoppingVy = hopVelocity('HOPPING', ENEMY_JUMP_VELOCITY);
    const hornedVy = hopVelocity('HORNED', HORNED_ENEMY_JUMP_VELOCITY);

    expect(hoppingVy, 'the hopping enemy launched upward').toBeLessThan(0);
    expect(hornedVy, 'the horned enemy launched upward too').toBeLessThan(0);
    expect(
      hornedVy - hoppingVy,
      'but 30% weaker than the hopping enemy',
    ).toBeCloseTo(ENEMY_JUMP_VELOCITY - HORNED_ENEMY_JUMP_VELOCITY);
  });

  it('should hold its column and bounce one block either side of its spawn when the enemy flies', () => {
    let state = withFlyingEnemy();
    expect(state.enemies[0].kind, 'nothing solid sits beneath this tile').toBe(
      'FLYING',
    );
    const spawn = state.enemies[0].spawn;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < 400; i++) {
      state = tick(state);
      const enemy = state.enemies[0];
      expect(enemy.statuses.isGrounded, `never grounded at tick ${i}`).toBe(
        false,
      );
      expect(enemy.position.x, `never drifts sideways at tick ${i}`).toBe(
        spawn.x,
      );
      minY = Math.min(minY, enemy.position.y);
      maxY = Math.max(maxY, enemy.position.y);
    }
    expect(minY, 'rises a full block above spawn').toBeCloseTo(
      spawn.y - TILE_SIZE,
    );
    expect(maxY, 'and falls a full block below spawn').toBeCloseTo(
      spawn.y + TILE_SIZE,
    );
  });

  it('should die like a hopping one when the flying enemy is stomped from above', () => {
    let state = withFlyingEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: {
        ...state.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + 1 - PLAYER_HEIGHT,
        },
        velocity: {
          ...state.player.velocity,
          y: { ...state.player.velocity.y, current: 1000 },
        },
        statuses: { ...state.player.statuses, isGrounded: false },
      },
    };
    state = tick(state);
    expect(state.enemies[0].timers.death, 'a clean stomp kills it too').toBe(0);
    expect(state.player.hearts.value, 'no damage from a clean stomp').toBe(
      BASE_HEARTS,
    );
    expect(state.player.velocity.y.current, 'the player bounces back up').toBe(
      -STOMP_BOUNCE_VELOCITY,
    );
  });
});

const spikeLevel = (col: number): GameLevel => {
  const level = testLevel();
  level.tiles[11][col] = TILE_SPIKE;
  return level;
};

const ceilingSpikeLevel = (col: number, row: number): GameLevel => {
  const level = testLevel();
  level.tiles[row - 1][col] = TILE_DIRT;
  level.tiles[row][col] = TILE_SPIKE_CEILING;
  return level;
};

describe('ceiling spikes', () => {
  const col = 6;
  const row = 9;

  it('should cost a heart when the player jumps up into the prongs', () => {
    let state = createInitialState(ceilingSpikeLevel(col, row), 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: col * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    state = tick(state);
    expect(state.player.hearts.value, 'safe while standing underneath').toBe(
      BASE_HEARTS,
    );

    state = act(state, { type: 'JUMP_START' });
    state = tickN(state, 20);
    expect(state.player.hearts.value, 'the jump ran into the prongs').toBe(
      BASE_HEARTS - 1,
    );
    expect(state.player.timers.invincibility).toBeGreaterThan(0);
    expect(
      state.player.timers.death,
      'a prong is not fatal on its own',
    ).toBeNull();
  });

  it('should spare the player when they stay under the prongs', () => {
    let state = createInitialState(ceilingSpikeLevel(col, row), 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: col * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    state = act(state, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, 60);
    expect(state.deaths, 'running underneath is safe').toBe(0);
    expect(state.player.position.x, 'walked on past').toBeGreaterThan(
      col * TILE_SIZE,
    );
  });
});

describe('precise spike collision', () => {
  const col = 6;
  const left = col * TILE_SIZE;

  it('should not be triggered when the box sits in the clear air above the prongs', () => {
    const level = spikeLevel(col);
    expect(isOverlappingSpike(level, left, 11 * TILE_SIZE, TILE_SIZE, 6)).toBe(
      false,
    );
  });

  it('should be triggered when the box reaches down into the prongs', () => {
    const level = spikeLevel(col);
    expect(
      isOverlappingSpike(level, left, 11 * TILE_SIZE + 23, TILE_SIZE, 6),
    ).toBe(true);
  });

  it('should not be triggered when the box sits in the notch between two prongs', () => {
    const level = spikeLevel(col);
    expect(isOverlappingSpike(level, left + 8, 11 * TILE_SIZE + 9, 5, 6)).toBe(
      false,
    );
  });
});

describe('lone spikes', () => {
  const col = 6;
  const left = col * TILE_SIZE;
  const isEdgeTouchingSpike = (level: Level, tileLeft: number): boolean =>
    isOverlappingSpike(
      level,
      tileLeft + 1,
      11 * TILE_SIZE + 8,
      8,
      TILE_SIZE - 8,
    );

  it('should leave the tile edges clear when nothing sits beside the spike', () => {
    expect(isEdgeTouchingSpike(spikeLevel(col), left)).toBe(false);
  });

  it('should fill the tile out to its edge when another spike sits beside it', () => {
    const level = spikeLevel(col);
    level.tiles[11][col + 1] = TILE_SPIKE;
    expect(isEdgeTouchingSpike(level, left)).toBe(true);
  });

  it('should leave the tile edges clear when the spike beside it hangs from the ceiling', () => {
    const level = spikeLevel(col);
    level.tiles[11][col + 1] = TILE_SPIKE_CEILING;
    expect(isEdgeTouchingSpike(level, left)).toBe(false);
  });

  it('should still be lethal when the player meets the spike head on', () => {
    expect(
      isOverlappingSpike(
        spikeLevel(col),
        left,
        11 * TILE_SIZE + 23,
        TILE_SIZE,
        6,
      ),
    ).toBe(true);
  });
});

describe('cannons', () => {
  const cannonTile: Point = { x: 8, y: 11 };
  const cannonX = cannonTile.x * TILE_SIZE;
  const cannonY = cannonTile.y * TILE_SIZE;

  const cannonLevel = (): GameLevel => {
    const level = testLevel();
    level.tiles[cannonTile.y][cannonTile.x] = TILE_CANNON;
    return level;
  };

  const standingAt = (level: GameLevel, x: number): GameState => {
    const state = createInitialState(level, 0, []);
    state.player.position.x = x;
    state.player.position.y = SURFACE - PLAYER_HEIGHT;
    return tick(state);
  };

  const withCannon = (x = 6 * TILE_SIZE): GameState =>
    standingAt(cannonLevel(), x);

  const OUTFIELD = 40;

  const wideCannonLevel = (): GameLevel => {
    const level = cannonLevel();
    const tiles = level.tiles.map((row, y) => [
      ...row,
      ...Array.from({ length: OUTFIELD }, (): Tile =>
        y >= 12 ? TILE_DIRT : TILE_AIR,
      ),
    ]);
    return { ...level, width: level.width + OUTFIELD, tiles };
  };

  const atRange = (tiles: number): GameState =>
    standingAt(wideCannonLevel(), cannonX + tiles * TILE_SIZE);

  const untilFired = (start: GameState): GameState => {
    let state = start;
    for (let i = 0; i < ticksFor(CANNON_RELOAD_SECONDS); i++) {
      if (size(state.cannonballs) > 0) return state;
      state = tick(state);
    }
    return state;
  };

  const untilStruck = (start: GameState): GameState => {
    let state = start;
    for (let i = 0; i < ticksFor(1); i++) {
      if (state.player.hearts.value < start.player.hearts.value) return state;
      state = tick(state);
    }
    return state;
  };

  it('should mount one cannon, loaded and waiting, when a tile asks for one', () => {
    const state = withCannon();
    expect(state.cannons).toHaveLength(1);
    expect(state.cannons[0].position).toEqual({ x: cannonX, y: cannonY });
    expect(state.cannonballs).toEqual([]);
  });

  it('should stop the run dead when the player walks into it', () => {
    let state = withCannon(4 * TILE_SIZE);
    state = act(state, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, ticksFor(1));
    expect(state.player.position.x + PLAYER_WIDTH).toBe(cannonX);
  });

  it('should hold the player up and shoot below their feet when they stand on it', () => {
    let state = withCannon();
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: cannonX + 5, y: cannonY - PLAYER_HEIGHT - 40 },
      },
    };
    state = tickN(state, ticksFor(CANNON_RELOAD_SECONDS + 0.5));
    expect(state.player.statuses.isGrounded, 'landed on the barrel').toBe(true);
    expect(state.player.position.y).toBe(cannonY - PLAYER_HEIGHT);
    expect(
      state.player.hearts.value,
      'the shot passes under the player standing on it',
    ).toBe(BASE_HEARTS);
  });

  it('should shoot a cannonball when three and a half seconds have passed', () => {
    let state = withCannon();
    let fired = 0;
    for (let i = 0; i < ticksFor(CANNON_RELOAD_SECONDS * 3 + 0.5); i++) {
      const next = tick(state);
      if (size(next.cannonballs) > size(state.cannonballs)) fired += 1;
      state = next;
    }
    expect(fired).toBe(3);
  });

  it('should hold its fire when the player keeps more than twenty blocks away', () => {
    let state = atRange(CANNON_RANGE_TILES + 2);
    state = tickN(state, ticksFor(CANNON_RELOAD_SECONDS * 2));
    expect(state.cannonballs, 'nothing to fear from that far off').toEqual([]);
  });

  it('should shoot when the player closes to twenty blocks', () => {
    let state = atRange(CANNON_RANGE_TILES + 2);
    state = tickN(state, ticksFor(CANNON_RELOAD_SECONDS * 2));
    state = {
      ...state,
      player: {
        ...state.player,
        position: {
          x: cannonX + (CANNON_RANGE_TILES - 2) * TILE_SIZE,
          y: SURFACE - PLAYER_HEIGHT,
        },
      },
    };
    state = untilFired(state);
    expect(state.cannonballs).toHaveLength(1);
  });

  it('should spend no reload when the player is out of range', () => {
    let state = atRange(CANNON_RANGE_TILES + 2);
    const loaded = state.cannons[0].timers.reload;
    state = tickN(state, ticksFor(CANNON_RELOAD_SECONDS));
    expect(state.cannons[0].timers.reload).toBe(loaded);
  });

  it('should turn to face the player when they cross to its other side', () => {
    let state = withCannon(2 * TILE_SIZE);
    expect(
      state.cannons[0].statuses.isFacingRight,
      'the player is off to its left',
    ).toBe(false);

    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 20 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    state = tick(state);
    expect(state.cannons[0].statuses.isFacingRight).toBe(true);
  });

  it('should send the shot the way the player went when it fires', () => {
    expect(
      untilFired(withCannon(2 * TILE_SIZE)).cannonballs[0].velocity.x,
    ).toEqual({ current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED });
    expect(
      untilFired(withCannon(20 * TILE_SIZE)).cannonballs[0].velocity.x.current,
    ).toBe(CANNONBALL_SPEED);
  });

  it('should fly flat and fast when the cannonball is in the air', () => {
    let state = untilFired(withCannon(2 * TILE_SIZE));
    const start = state.cannonballs[0].position;
    state = tickN(state, 12);
    const flown = state.cannonballs[0].position;
    expect(flown.y, 'not a hair of drop').toBe(start.y);
    expect(start.x - flown.x).toBeCloseTo(
      CANNONBALL_SPEED * 12 * DELTA_SECONDS,
    );
  });

  it('should fly on through, keeping to a layer of its own, when the cannonball meets a wall', () => {
    const level = cannonLevel();
    const wallX = 5 * TILE_SIZE;
    level.tiles[11][5] = TILE_DIRT;
    let state = untilFired(standingAt(level, 2 * TILE_SIZE));
    for (let i = 0; i < ticksFor(1); i++) {
      if (size(state.cannonballs) === 0) break;
      if (state.cannonballs[0].position.x < wallX) break;
      state = tick(state);
    }
    expect(size(state.cannonballs), 'the wall never stopped it').toBe(1);
    expect(state.cannonballs[0].position.x).toBeLessThan(wallX);
  });

  it('should cost a heart and be spent when the cannonball catches the player', () => {
    let state = untilFired(withCannon());
    expect(state.cannonballs).toHaveLength(1);
    state = untilStruck(state);
    expect(state.player.hearts.value, 'the hit drains a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(state.player.timers.invincibility).toBeGreaterThan(0);
    expect(state.player.timers.death, 'no death, no respawn').toBeNull();
    expect(state.cannonballs, 'the ball is spent on the hit').toEqual([]);
  });

  it('should end the run when the cannonball takes the last heart', () => {
    let state = withCannon();
    state = { ...state, player: { ...state.player, hearts: { value: 1 } } };
    state = untilStruck(untilFired(state));
    expect(state.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(state.status, 'and the run is over').toBe('GAME_OVER');
    expect(state.player.timers.death).not.toBeNull();
  });

  it('should fly straight through when the player is still glowing with invincibility', () => {
    let state = untilStruck(untilFired(withCannon()));
    const hearts = state.player.hearts.value;
    state = {
      ...state,
      cannonballs: [
        {
          position: {
            x: state.player.position.x,
            y: state.player.position.y + PLAYER_HEIGHT / 2,
          },
          velocity: {
            x: { current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED },
          },
        },
      ],
    };
    state = tick(state);
    expect(state.player.hearts.value).toBe(hearts);
    expect(state.cannonballs, 'and is not spent on the pass').toHaveLength(1);
  });

  it('should be swept away when the cannonball flies off the end of the level', () => {
    let state = withCannon();
    state = {
      ...state,
      cannonballs: [
        {
          position: { x: 0, y: SURFACE - CANNONBALL_SIZE },
          velocity: {
            x: { current: -CANNONBALL_SPEED, max: CANNONBALL_SPEED },
          },
        },
      ],
    };
    state = tickN(state, ticksFor(0.2));
    expect(state.cannonballs).toEqual([]);
  });

  it('should reload every cannon and clear the air when the player respawns', () => {
    let state = untilFired(withCannon());
    expect(state.cannonballs).toHaveLength(1);
    state = act(state, { type: 'RESPAWN' });
    expect(state.cannonballs).toEqual([]);
    expect(state.cannons[0].timers.reload).toBe(CANNON_RELOAD_SECONDS);
  });

  it('should mount the cannons of the new level when the next level loads', () => {
    let state = createInitialState(testLevel(), 0, []);
    expect(state.cannons).toEqual([]);
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: cannonLevel(),
      levelIndex: 1,
    });
    expect(state.cannons).toHaveLength(1);
  });
});

describe('the gear that wards off spikes', () => {
  const spikeCol = 6;
  const spikeX = spikeCol * TILE_SIZE;

  const ceilingCol = 6;
  const ceilingRow = 9;

  const standingOnSpikes = (...gear: Item[]): GameState => {
    const state = createInitialState(spikeLevel(spikeCol), 0, gear);
    return {
      ...state,
      player: {
        ...state.player,
        position: { x: spikeX, y: SURFACE - PLAYER_HEIGHT },
      },
    };
  };

  const underCeilingSpikes = (...gear: Item[]): GameState => {
    const state = createInitialState(
      ceilingSpikeLevel(ceilingCol, ceilingRow),
      0,
      gear,
    );
    return {
      ...state,
      player: {
        ...state.player,
        position: { x: ceilingCol * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
  };

  const jumpedIntoTheCeiling = (state: GameState): GameState =>
    tickN(act(tick(state), { type: 'JUMP_START' }), 20);

  it('should walk the player over the floor spikes when they wear the Boots of Clouds', () => {
    const state = tickN(standingOnSpikes(BOOTS_OF_CLOUDS), ticksFor(1));

    expect(state.player.hearts.value, 'not a scratch').toBe(BASE_HEARTS);
    expect(state.player.timers.death, 'and still on their feet').toBeNull();
    expect(state.deaths).toBe(0);
  });

  it('should let the floor spikes bite when the player has no boots', () => {
    const state = tick(standingOnSpikes());

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should shrug the ceiling spikes off when the player wears the Titanium Helmet', () => {
    const state = jumpedIntoTheCeiling(underCeilingSpikes(TITANIUM_HELMET));

    expect(state.player.hearts.value, 'the prongs glance off').toBe(
      BASE_HEARTS,
    );
    expect(state.deaths).toBe(0);
  });

  it('should let the ceiling spikes bite when the player has no helmet', () => {
    const state = jumpedIntoTheCeiling(underCeilingSpikes());

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should let the ceiling spikes bite when the player wears only the boots', () => {
    const state = jumpedIntoTheCeiling(underCeilingSpikes(BOOTS_OF_CLOUDS));

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should let the floor spikes bite when the player wears only the helmet', () => {
    const state = tick(standingOnSpikes(TITANIUM_HELMET));

    expect(state.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('should keep the gear on when the next level loads', () => {
    const state = act(standingOnSpikes(BOOTS_OF_CLOUDS), {
      type: 'LOAD_LEVEL',
      level: spikeLevel(spikeCol),
      levelIndex: 1,
    });

    expect(
      tickN(
        {
          ...state,
          player: {
            ...state.player,
            position: { x: spikeX, y: SURFACE - PLAYER_HEIGHT },
          },
        },
        ticksFor(1),
      ).player.hearts.value,
      'the boots came along',
    ).toBe(BASE_HEARTS);
  });

  it('should still cost a heart when an enemy touches a player in full gear', () => {
    const state = createInitialState(testLevel([{ x: 5, y: 11 }]), 0, [
      BOOTS_OF_CLOUDS,
      TITANIUM_HELMET,
    ]);
    const settled = tickN(
      {
        ...state,
        player: {
          ...state.player,
          position: {
            x: state.enemies[0].position.x,
            y: SURFACE - PLAYER_HEIGHT,
          },
        },
      },
      2,
    );

    expect(settled.player.hearts.value).toBeLessThan(BASE_HEARTS);
  });
});

describe('hearts', () => {
  const emberHeart = (id = 'EMBER-HEART'): Item =>
    item(id, { kind: 'HEART', amount: 1 });

  const spikeX = 6 * TILE_SIZE;
  const safeX = 2 * TILE_SIZE;

  const placeAt = (state: GameState, x: number): GameState => ({
    ...state,
    player: {
      ...state.player,
      position: { x, y: SURFACE - PLAYER_HEIGHT },
    },
  });

  it('should hold a full complement of hearts when level one starts', () => {
    expect(createInitialState(testLevel(), 0, []).player.hearts.value).toBe(
      BASE_HEARTS,
    );
  });

  it('should add a heart on the spot when the player takes one from the chest', () => {
    let state = createInitialState(testLevel(), 0, []);
    expect(state.player.hearts.value).toBe(BASE_HEARTS);

    state = {
      ...state,
      status: 'CHEST',
      level: { ...state.level, chestItems: [emberHeart()] },
    };
    state = act(state, { type: 'CHOOSE_ITEM', index: 0 });
    expect(
      state.player.hearts.value,
      'the collected heart lands immediately',
    ).toBe(BASE_HEARTS + 1);
    expect(state.inventory).toHaveLength(1);
  });

  it('should carry the hearts over without topping them up when the next level loads', () => {
    let state = createInitialState(testLevel(), 0, [emberHeart()]);
    expect(state.player.hearts.value, 'base plus one collected').toBe(
      BASE_HEARTS + 1,
    );

    state = {
      ...state,
      player: { ...state.player, hearts: { value: 1 } },
    };
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: testLevel(),
      levelIndex: 1,
    });
    expect(state.player.hearts.value, 'the next level does not refill').toBe(1);
  });

  it('should spend one heart and respawn with the rest when the player falls into the pit', () => {
    let state = createInitialState(testLevel(), 0, [
      emberHeart('H1'),
      emberHeart('H2'),
    ]);
    expect(state.player.hearts.value).toBe(BASE_HEARTS + 2);

    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 10 * TILE_SIZE + 5, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    state = tickN(state, 120);
    expect(state.player.position.x, 'respawned at spawn').toBe(SPAWN_X);
    expect(state.player.hearts.value, 'down just one heart').toBe(
      BASE_HEARTS + 1,
    );
    expect(state.deaths).toBe(1);
  });

  it('should shrug the hit off when the player is invincible and take it once that lapses', () => {
    let state = placeAt(
      createInitialState(spikeLevel(6), 0, [emberHeart()]),
      spikeX,
    );
    expect(state.player.hearts.value).toBe(BASE_HEARTS + 1);

    state = tick(state);
    expect(state.player.hearts.value, 'the spike takes one heart').toBe(
      BASE_HEARTS,
    );
    const granted = state.player.timers.invincibility;
    expect(granted).toBeGreaterThan(0);

    state = tick(placeAt(state, spikeX));
    expect(
      state.player.hearts.value,
      'a second bite bounces off the i-frames',
    ).toBe(BASE_HEARTS);
    expect(
      state.player.timers.invincibility,
      'and the timer keeps ticking',
    ).toBeLessThan(granted);

    state = tickN(placeAt(state, safeX), ticksFor(HURT_INVINCIBLE_SECONDS));
    expect(
      state.player.timers.invincibility,
      'invincibility has worn off',
    ).toBe(0);
    expect(state.player.hearts.value, 'no damage taken while safe').toBe(
      BASE_HEARTS,
    );

    state = tick(placeAt(state, spikeX));
    expect(state.player.hearts.value, 'the spike bites once more').toBe(
      BASE_HEARTS - 1,
    );
    expect(state.player.timers.invincibility).toBeGreaterThan(0);
  });

  it('should soak up several hits and fall on the last when the player has a stockpile of hearts', () => {
    let state = placeAt(
      createInitialState(spikeLevel(6), 0, [
        emberHeart('H1'),
        emberHeart('H2'),
      ]),
      spikeX,
    );
    expect(state.player.hearts.value, 'base plus two collected').toBe(
      BASE_HEARTS + 2,
    );
    const deaths = state.deaths;

    for (let heartsLeft = BASE_HEARTS + 1; heartsLeft >= 1; heartsLeft--) {
      state = tick(placeAt(state, spikeX));
      expect(state.player.hearts.value).toBe(heartsLeft);
      expect(state.player.timers.death, 'still alive').toBeNull();
      expect(state.status, 'and still playing').toBe('PLAYING');
      state = tickN(placeAt(state, safeX), ticksFor(HURT_INVINCIBLE_SECONDS));
    }
    expect(state.deaths, 'survived every hit').toBe(deaths);

    state = tick(placeAt(state, spikeX));
    expect(state.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(
      state.player.timers.death,
      'the hit that takes the last heart is fatal',
    ).not.toBeNull();
    expect(state.status, 'and ends the run').toBe('GAME_OVER');
    expect(state.deaths, 'and counts as a death').toBe(deaths + 1);
  });

  it('should shield the player for two seconds only when a heart is lost', () => {
    const hurt = tick(
      placeAt(createInitialState(spikeLevel(6), 0, []), spikeX),
    );

    expect(hurt.player.timers.invincibility).toBe(HURT_INVINCIBLE_SECONDS);
  });

  it('should redden the player for a split second when a heart is lost', () => {
    let state = tick(placeAt(createInitialState(spikeLevel(6), 0, []), spikeX));

    expect(state.player.timers.hurt).toBe(HURT_FLASH_SECONDS);
    expect(
      HURT_FLASH_SECONDS,
      'far shorter than the shield it rides along with',
    ).toBeLessThan(HURT_INVINCIBLE_SECONDS);

    state = tickN(placeAt(state, safeX), ticksFor(HURT_FLASH_SECONDS));
    expect(state.player.timers.hurt, 'the red drains away').toBe(0);
    expect(
      state.player.timers.invincibility,
      'while the shield is still up',
    ).toBeGreaterThan(0);
  });

  it('should leave the player their own colour when a hit glances off the invincibility', () => {
    let state = tick(placeAt(createInitialState(spikeLevel(6), 0, []), spikeX));
    state = tickN(placeAt(state, safeX), ticksFor(HURT_FLASH_SECONDS));

    state = tick(placeAt(state, spikeX));
    expect(state.player.timers.hurt, 'no heart lost, no flash').toBe(0);
  });
});

describe('the star', () => {
  const spikeX = 6 * TILE_SIZE;

  const placeAt = (state: GameState, x: number): GameState => ({
    ...state,
    player: {
      ...state.player,
      position: { x, y: SURFACE - PLAYER_HEIGHT },
    },
  });

  const star = (id = 'NIGHT-STAR', amount = 1): Item =>
    item(id, { kind: 'STAR', amount });

  const carrying = (...stars: Item[]): GameState =>
    createInitialState(spikeLevel(6), 0, stars);

  const useStar = (state: GameState): GameState =>
    act(state, { type: 'USE_STAR' });

  it('should buy three seconds of invincibility when the player spends a star', () => {
    const state = useStar(carrying(star()));

    expect(state.player.timers.invincibility).toBe(STAR_INVINCIBLE_SECONDS);
    expect(state.stars, 'and the star is spent').toBe(0);
  });

  it('should burn through the pack one star at a time when the player spends them', () => {
    const state = useStar(carrying(star('FIRST'), star('SECOND')));

    expect(state.stars).toBe(1);
    expect(useStar(state).stars, 'and then the last of them').toBe(0);
  });

  it('should count what the card is worth rather than how many cards there are when the pack is loaded', () => {
    expect(carrying(star('TWIN-STAR', 2)).stars).toBe(2);
  });

  it('should do nothing when the pack is empty', () => {
    const state = carrying();

    expect(simulation(useStar(state))).toEqual(simulation(state));
  });

  it('should keep the cards on the record when they have been spent', () => {
    const trinket = item('KEEPSAKE');
    const state = useStar(carrying(trinket, star()));

    expect(state.inventory).toEqual([trinket, star()]);
    expect(state.stars, 'though the star itself is gone').toBe(0);
  });

  it('should walk the player through spikes unharmed when the star still lasts', () => {
    let state = useStar(carrying(star()));
    const hearts = state.player.hearts.value;

    state = tickN(placeAt(state, spikeX), ticksFor(1));
    expect(state.player.hearts.value, 'the spikes cannot bite').toBe(hearts);
    expect(state.player.timers.death, 'and the player lives on').toBeNull();
  });

  it('should leave the player mortal again when its three seconds have run out', () => {
    let state = useStar(carrying(star()));
    const hearts = state.player.hearts.value;

    state = tickN(state, ticksFor(STAR_INVINCIBLE_SECONDS));
    expect(state.player.timers.invincibility, 'the glow fades').toBe(0);

    state = tick(placeAt(state, spikeX));
    expect(state.player.hearts.value, 'and the spike bites again').toBe(
      hearts - 1,
    );
  });

  it('should light the player up when the star shield holds', () => {
    const state = useStar(carrying(star()));

    expect(state.player.timers.star).toBe(STAR_INVINCIBLE_SECONDS);
    expect(
      tickN(state, ticksFor(STAR_INVINCIBLE_SECONDS)).player.timers.star,
      'and puts the glow out when it lapses',
    ).toBe(0);
  });

  it('should leave the player dark when a heart is merely lost', () => {
    const hurt = tick(placeAt(carrying(star()), spikeX));

    expect(
      hurt.player.timers.invincibility,
      'the heart-loss shield is up',
    ).toBeGreaterThan(0);
    expect(hurt.player.timers.star, 'but nothing is glowing').toBe(0);
  });

  it('should top the shield back up to a full three seconds when a star is spent on a fading one', () => {
    const hurt = tick(placeAt(carrying(star()), spikeX));
    expect(hurt.player.timers.invincibility).toBeLessThan(
      STAR_INVINCIBLE_SECONDS,
    );

    expect(useStar(hurt).player.timers.invincibility).toBe(
      STAR_INVINCIBLE_SECONDS,
    );
  });

  it('should keep the star unspent when the chest is still open', () => {
    const state: GameState = { ...carrying(star()), status: 'CHEST' };

    expect(useStar(state).stars).toBe(1);
  });

  it('should carry the stars left over when the next level loads', () => {
    const state = act(useStar(carrying(star('TWIN-STAR', 2))), {
      type: 'LOAD_LEVEL',
      level: testLevel(),
      levelIndex: 1,
    });

    expect(state.stars).toBe(1);
  });
});

describe('bullets', () => {
  const enemySpawn: Point = { x: 7, y: 11 };
  const shooterX = 5 * TILE_SIZE;

  const rounds = (amount: number): Item =>
    item('AMMO-BELT', { kind: 'BULLET', amount });

  const armedAt = (
    level: GameLevel,
    x: number,
    amount: number,
    kind?: EnemyKind,
  ): GameState => {
    const state = createInitialState(level, 0, [rounds(amount)]);
    state.player.position.x = x;
    state.player.position.y = SURFACE - PLAYER_HEIGHT;
    return tick({
      ...state,
      enemies: map(state.enemies, (enemy) => ({
        ...enemy,
        kind: kind ?? enemy.kind,
        position: { ...enemy.position, y: SURFACE - ENEMY_HEIGHT },
      })),
    });
  };

  const armed = (amount: number): GameState =>
    armedAt(testLevel(), shooterX, amount);

  const fire = (state: GameState): GameState => act(state, { type: 'SHOOT' });

  const facing = (state: GameState, isRight: boolean): GameState =>
    tickN(
      act(state, {
        type: isRight ? 'MOVE_RIGHT_START' : 'MOVE_LEFT_START',
      }),
      3,
    );

  it('should load a round for every bullet when the pack holds them', () => {
    expect(armed(3).ammo).toBe(3);
  });

  it('should spend a round and put a bullet in the air when the player shoots', () => {
    const state = fire(armed(2));

    expect(state.ammo, 'one round lighter').toBe(1);
    expect(size(state.bullets), 'and one bullet away').toBe(1);
  });

  it('should do nothing when the gun is empty', () => {
    const state = armedAt(testLevel(), shooterX, 0);

    expect(simulation(fire(state))).toEqual(simulation(state));
  });

  it('should send the bullet the way the player faces when they shoot', () => {
    const rightward = fire(facing(armed(2), true));
    const leftward = fire(facing(armed(2), false));

    expect(rightward.bullets[0].velocity.x.current).toBeGreaterThan(0);
    expect(leftward.bullets[0].velocity.x.current).toBeLessThan(0);
  });

  it('should fly on through walls and leave the level behind when the bullet is in the air', () => {
    let state = fire(facing(armed(1), false));

    state = tickN(state, ticksFor(0.2));
    expect(size(state.bullets), 'still in the air').toBe(1);

    state = tickN(state, ticksFor(1));
    expect(state.bullets, 'and it is gone once past the wall').toEqual([]);
  });

  it('should shatter the floor spike and be spent on it when the bullet hits one', () => {
    let state = fire(facing(armedAt(spikeLevel(3), shooterX, 1), false));

    state = tickN(state, ticksFor(0.2));
    expect(state.level.tiles[11][3], 'the spike is gone').toBe(TILE_AIR);
    expect(state.bullets, 'and so is the bullet').toEqual([]);
    expect(
      isOverlappingSpike(state.level, 3 * TILE_SIZE, 11 * TILE_SIZE, 1, 1),
      'nothing is left there to bite',
    ).toBe(false);
  });

  it('should shatter the ceiling spike when it hangs low enough to be hit', () => {
    let state = fire(
      facing(armedAt(ceilingSpikeLevel(3, 11), shooterX, 1), false),
    );

    state = tickN(state, ticksFor(0.2));
    expect(state.level.tiles[11][3]).toBe(TILE_AIR);
    expect(state.bullets).toEqual([]);
  });

  it('should keep the shattered spikes gone when the player respawns', () => {
    let state = fire(facing(armedAt(spikeLevel(3), shooterX, 1), false));

    state = act(tickN(state, ticksFor(0.2)), { type: 'RESPAWN' });
    expect(state.level.tiles[11][3]).toBe(TILE_AIR);
  });

  it('should shoot the hanging spike down when it has not dropped yet', () => {
    const level = testLevel();
    level.tiles[11][3] = TILE_SPIKE_FALLING;
    let state = fire(facing(armedAt(level, 8 * TILE_SIZE, 1), false));

    expect(size(state.fallingSpikes), 'still hanging').toBe(1);
    state = tickN(state, ticksFor(0.5));
    expect(state.fallingSpikes, 'the spike is gone').toEqual([]);
    expect(state.bullets, 'and so is the bullet').toEqual([]);
  });

  it('should drop the enemy and be spent on the kill when the bullet hits one', () => {
    const kinds: EnemyKind[] = ['HOPPING', 'HORNED', 'FLYING'];

    for (const kind of kinds) {
      const level = testLevel([enemySpawn]);
      let state = fire(armedAt(level, shooterX, 1, kind));

      state = tickN(state, ticksFor(0.3));
      expect(
        state.enemies[0].timers.death,
        `the ${kind} enemy is down`,
      ).not.toBeNull();
      expect(state.bullets, `and the ${kind} kill spent the bullet`).toEqual(
        [],
      );
    }
  });

  it('should cost the player nothing when they shoot an enemy down', () => {
    const level = testLevel([enemySpawn]);
    let state = fire(armedAt(level, shooterX, 1, 'HORNED'));

    state = tickN(state, ticksFor(0.3));
    expect(state.player.hearts.value, 'no horn ever reached them').toBe(
      BASE_HEARTS,
    );
    expect(state.status).toBe('PLAYING');
  });

  it('should keep the gun holstered when the chest is open', () => {
    const state: GameState = { ...armed(1), status: 'CHEST' };

    expect(fire(state).ammo).toBe(1);
    expect(fire(state).bullets).toEqual([]);
  });

  it('should clear the bullets in the air but keep the rounds left when the player respawns', () => {
    const state = act(fire(armed(2)), { type: 'RESPAWN' });

    expect(state.bullets).toEqual([]);
    expect(state.ammo, 'the spent round stays spent').toBe(1);
  });

  it('should carry the rounds left over when the next level loads', () => {
    const state = act(fire(armed(3)), {
      type: 'LOAD_LEVEL',
      level: testLevel(),
      levelIndex: 1,
    });

    expect(state.ammo).toBe(2);
    expect(state.bullets, 'though the shot in flight is left behind').toEqual(
      [],
    );
  });
});

describe('score', () => {
  const atPortal = (seconds: number): GameState => ({
    ...settledAt(25 * TILE_SIZE - 10),
    time: seconds,
  });

  const enterPortal = (state: GameState): GameState =>
    act(state, { type: 'INTERACT' });

  it('should have nothing scored when a run starts', () => {
    expect(createInitialState(testLevel(), 0, []).score).toBe(0);
  });

  const paidFor = (seconds: number): number =>
    LEVEL_SCORE_BASE - LEVEL_SCORE_PER_SECOND * seconds;

  it('should pay the base rate less a hundred for every second when the level is finished', () => {
    expect(enterPortal(atPortal(0)).score).toBe(LEVEL_SCORE_BASE);
    expect(enterPortal(atPortal(12)).score).toBe(paidFor(12));
  });

  it('should charge whole seconds only when the clock stops part-way through one', () => {
    expect(enterPortal(atPortal(12.4)).score, 'rounds down').toBe(paidFor(12));
    expect(enterPortal(atPortal(12.6)).score, 'rounds up').toBe(paidFor(13));
  });

  it('should still pay a hundred when the level took all day', () => {
    const floorSeconds =
      (LEVEL_SCORE_BASE - LEVEL_SCORE_MIN) / LEVEL_SCORE_PER_SECOND;

    expect(enterPortal(atPortal(900)).score).toBe(LEVEL_SCORE_MIN);
    expect(
      enterPortal(atPortal(floorSeconds)).score,
      'the last second it pays more',
    ).toBe(LEVEL_SCORE_MIN);
    expect(enterPortal(atPortal(floorSeconds - 1)).score).toBe(
      LEVEL_SCORE_MIN + LEVEL_SCORE_PER_SECOND,
    );
  });

  it('should bill each level against its own clock when the score adds up over a run', () => {
    let state = enterPortal(atPortal(10));
    expect(state.score, 'the first level, taken in ten seconds').toBe(
      paidFor(10),
    );

    state = act(state, {
      type: 'LOAD_LEVEL',
      level: testLevel(),
      levelIndex: 1,
    });
    state = enterPortal({ ...state, time: 30, isNearPortal: true });
    expect(
      state.score,
      'the second is billed against its own thirty seconds',
    ).toBe(paidFor(10) + paidFor(30));
  });

  it('should keep the seconds each level took when the run moves on', () => {
    let state = enterPortal(atPortal(10));
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: testLevel(),
      levelIndex: 1,
    });
    state = enterPortal({ ...state, time: 30, isNearPortal: true });

    expect(state.levelTimes).toEqual([10, 30]);
    expect(computeTotalTime(state.levelTimes)).toBe(40);
  });

  it('should pay out on the spot when the player takes a red gem', () => {
    let state: GameState = {
      ...createInitialState(testLevel(), 0, []),
      status: 'CHEST',
    };
    state = {
      ...state,
      level: { ...state.level, chestItems: [RED_GEM] },
    };
    state = act(state, { type: 'CHOOSE_ITEM', index: 0 });
    expect(state.score).toBe(1500);
  });
});

describe('gems', () => {
  const GEM_ROW = SURFACE / TILE_SIZE - 2;
  const LEFT_COLUMN = 5;
  const RIGHT_COLUMN = 8;

  const strewnWith = (columns: number[]): GameLevel => {
    const level = testLevel();
    for (const column of columns) level.tiles[GEM_ROW][column] = TILE_GEM;
    return level;
  };

  const standingAt = (level: GameLevel, column: number): GameState => {
    const state = createInitialState(level, 0, []);
    state.player.position.x =
      column * TILE_SIZE + (TILE_SIZE - PLAYER_WIDTH) / 2;
    state.player.position.y = SURFACE - PLAYER_HEIGHT;
    return state;
  };

  it('should set out every gem when the level was strewn with them', () => {
    const state = createInitialState(
      strewnWith([LEFT_COLUMN, RIGHT_COLUMN]),
      0,
      [],
    );

    expect(state.gems).toEqual([
      { x: LEFT_COLUMN, y: GEM_ROW },
      { x: RIGHT_COLUMN, y: GEM_ROW },
    ]);
  });

  it('should pay five hundred when the player walks into a gem', () => {
    const state = tick(
      standingAt(strewnWith([LEFT_COLUMN, RIGHT_COLUMN]), LEFT_COLUMN),
    );

    expect(state.score).toBe(GEM_SCORE);
    expect(state.gems, 'and takes it off the ground').toEqual([
      { x: RIGHT_COLUMN, y: GEM_ROW },
    ]);
  });

  it('should pay for the gem once when the player loiters over it', () => {
    const state = tickN(
      standingAt(strewnWith([LEFT_COLUMN, RIGHT_COLUMN]), LEFT_COLUMN),
      120,
    );

    expect(state.score).toBe(GEM_SCORE);
  });

  it('should collect the gems one after another when the player runs the level', () => {
    let state = act(standingAt(strewnWith([LEFT_COLUMN, RIGHT_COLUMN]), 3), {
      type: 'MOVE_RIGHT_START',
    });
    state = tickN(state, 240);

    expect(state.score).toBe(GEM_SCORE * 2);
    expect(state.gems).toEqual([]);
  });

  it('should leave the gem where it lies when the player never comes near it', () => {
    const state = tickN(
      standingAt(strewnWith([LEFT_COLUMN, RIGHT_COLUMN]), 3),
      120,
    );

    expect(state.score).toBe(0);
    expect(state.gems).toHaveLength(2);
  });

  it('should keep the gems already pocketed when the player dies', () => {
    let state = tick(
      standingAt(strewnWith([LEFT_COLUMN, RIGHT_COLUMN]), LEFT_COLUMN),
    );
    state = act(state, { type: 'RESPAWN' });

    expect(state.gems).toHaveLength(1);
    expect(state.score).toBe(GEM_SCORE);
  });

  it('should strew the next level afresh and keep what the last one paid when it loads', () => {
    let state = tick(
      standingAt(strewnWith([LEFT_COLUMN, RIGHT_COLUMN]), LEFT_COLUMN),
    );
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: strewnWith([LEFT_COLUMN]),
      levelIndex: 1,
    });

    expect(state.gems).toEqual([{ x: LEFT_COLUMN, y: GEM_ROW }]);
    expect(state.score).toBe(GEM_SCORE);
  });

  it('should pocket no gem when the player is dead', () => {
    const level = strewnWith([LEFT_COLUMN]);
    let state = standingAt(level, LEFT_COLUMN);
    state = {
      ...state,
      player: { ...state.player, timers: { ...state.player.timers, death: 0 } },
    };
    state = tick(state);

    expect(state.gems).toHaveLength(1);
    expect(state.score).toBe(0);
  });
});

describe('items', () => {
  const opened = (item: Item): GameState => {
    const state = createInitialState(testLevel(), 0, []);
    return act(
      {
        ...state,
        status: 'CHEST',
        level: { ...state.level, chestItems: [item] },
      },
      { type: 'CHOOSE_ITEM', index: 0 },
    );
  };

  it('should be worth two hearts when the card is a double heart', () => {
    expect(opened(DOUBLE_HEART).player.hearts.value).toBe(BASE_HEARTS + 2);
  });

  it('should be worth points rather than hearts when the card is a red gem', () => {
    const state = opened(RED_GEM);
    expect(state.player.hearts.value).toBe(BASE_HEARTS);
    expect(state.score).toBe(1500);
  });

  it('should be worth a turn of invincibility for each star when the card is a single, double or triple', () => {
    expect(opened(STAR).stars).toBe(1);
    expect(opened(DOUBLE_STAR).stars).toBe(2);
    expect(opened(TRIPLE_STAR).stars).toBe(3);
  });

  it('should be worth 2750 points when the card is a pink gem', () => {
    const state = opened(PINK_GEM);

    expect(state.score).toBe(2750);
    expect(state.player.hearts.value, 'and no hearts').toBe(BASE_HEARTS);
  });

  it('should be kept rather than spent when the card is a piece of gear', () => {
    expect(opened(BOOTS_OF_CLOUDS).inventory).toEqual([BOOTS_OF_CLOUDS]);
    expect(opened(TITANIUM_HELMET).inventory).toEqual([TITANIUM_HELMET]);
  });

  it('should stack on top of the stars already carried when the card is a double star', () => {
    const state = opened(STAR);

    expect(
      act(
        {
          ...state,
          status: 'CHEST',
          level: { ...state.level, chestItems: [DOUBLE_STAR] },
        },
        { type: 'CHOOSE_ITEM', index: 0 },
      ).stars,
    ).toBe(3);
  });

  it('should load what its name promises when the card is a bullet card', () => {
    expect(opened(BULLET).ammo).toBe(2);
    expect(opened(TWO_BULLETS).ammo).toBe(4);
    expect(opened(THREE_BULLETS).ammo).toBe(6);
    expect(opened(FOUR_BULLETS).ammo).toBe(8);
    expect(opened(VAMPIRE_SLAYER_BULLET_RAIN).ammo).toBe(9999);
  });

  it('should stack on top of the rounds already carried when a second bullet card is taken', () => {
    const state = opened(TWO_BULLETS);

    expect(
      act(
        {
          ...state,
          status: 'CHEST',
          level: { ...state.level, chestItems: [THREE_BULLETS] },
        },
        { type: 'CHOOSE_ITEM', index: 0 },
      ).ammo,
    ).toBe(10);
  });
});

describe('restarting after a run ends', () => {
  it('should deal level one again with hearts refilled and nothing scored when the run restarts', () => {
    let state = act(
      {
        ...createInitialState(testLevel(), 0, []),
        status: 'CHEST',
      },
      { type: 'CHOOSE_ITEM', index: 0 },
    );
    state = {
      ...state,
      time: 40,
      deaths: 2,
      levelIndex: 3,
      score: 12345,
      status: 'GAME_OVER',
    };

    state = act(state, { type: 'RESTART', level: testLevel() });

    expect(state.levelIndex, 'back to level one').toBe(0);
    expect(state.status).toBe('PLAYING');
    expect(state.player.hearts.value, 'with a full complement').toBe(
      BASE_HEARTS,
    );
    expect(state.score, 'and nothing carried over').toBe(0);
    expect(state.time, 'on a clock wound back to zero').toBe(0);
    expect(state.deaths).toBe(0);
    expect(state.inventory, 'and an empty pack').toHaveLength(0);
    expect(state.player.position.x).toBe(SPAWN_X);
  });
});
