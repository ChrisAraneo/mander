import type { Point } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import type { Action } from '../actions/actions';
import { overlapsSpike } from './collision/overlaps-spike';
import {
  ENEMY_DEATH_SECONDS,
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
} from './enemy/consts';
import { capabilitiesFor } from './player/capabilities-for';
import {
  INVINCIBLE_SECONDS,
  MAX_SPEED_BONUS_PERCENT,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from './player/consts';
import { spawnPosition } from './player/spawn-position';
import { createInitialState } from '../state/create-initial-state';
import type { GameState } from '../state/game-state';
import { reduce } from './reduce';
import {
  type Item,
  type Level,
  MAX_JUMP_TILES,
  type Palette,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_KEY,
  TILE_PORTAL,
  TILE_SPAWN,
  TILE_SIZE,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
} from '@mander/model';

const PALETTE: Palette = {
  sky: ['HSL(0, 0%, 10%)', 'HSL(0, 0%, 20%)', 'HSL(0, 0%, 30%)'],
  hills: ['HSL(0, 0%, 16%)', 'HSL(0, 0%, 12%)'],
  block: 'HSL(0, 0%, 26%)',
  blockCap: 'HSL(90, 40%, 50%)',
  blockCapHighlight: 'HSL(90, 45%, 56%)',
};

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
  item('CARD-1', { kind: 'SPEED', percent: 5 }),
  item('CARD-2'),
  item('CARD-3'),
  item('CARD-4'),
];

const testLevel = (enemies: Point[] = []): Level => {
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
  return {
    seed: 'TEST',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    chestItems: CARDS,
    enemies,
    palette: PALETTE,
  };
};

const SPAWN_X = spawnPosition(testLevel()).x;

const DELTA_SECONDS = 1 / 60;

const act = (state: GameState, action: Action) => reduce(state, action);
const tick = (state: GameState) =>
  reduce(state, { type: 'TICK', deltaSeconds: DELTA_SECONDS });

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
  it('applies gravity until the player lands', () => {
    let state = createInitialState(testLevel(), 0, []);
    expect(state.player.statuses.isGrounded).toBe(false);
    state = tickN(state, 60);
    expect(state.player.statuses.isGrounded).toBe(true);
    expect(state.player.position.y).toBe(SURFACE - PLAYER_HEIGHT);
    expect(state.player.velocity.y.current).toBe(0);
  });

  it('moves with MOVE_RIGHT_START and stops with MOVE_RIGHT_STOP', () => {
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

  it('is stopped by walls when moving left', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'MOVE_LEFT_START' });
    state = tickN(state, 600);
    expect(state.player.position.x).toBe(TILE_SIZE);
    expect(state.player.velocity.x.current).toBe(0);
    expect(state.player.statuses.isFacingRight).toBe(false);
  });

  it('is too tall to squeeze under a ceiling one tile above the ground', () => {
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

  it('respawns, counts a death, and spends a heart after falling into the pit', () => {
    const start = settledAt(8 * TILE_SIZE);
    start.player.position.x = 10 * TILE_SIZE + 5;
    const state = tickN(start, 120);
    expect(state.deaths).toBe(1);
    expect(state.player.position.x).toBe(SPAWN_X);
    expect(state.player.hearts.value, 'the fall cost a heart').toBe(0);
  });

  it('RESPAWN resets the player position but keeps key and inventory', () => {
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
  it('jumps on JUMP_START only when grounded — there is no double jump', () => {
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

  it('ignores held-key repeats of JUMP_START', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    const rising = state.player.velocity.y.current;
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    expect(state.player.velocity.y.current).toBeGreaterThan(rising);
    expect(state.player.velocity.y.current).toBeLessThan(0);
  });

  it('re-jumps on landing while the jump button stays held', () => {
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

  it('makes short taps jump lower than held presses', () => {
    const start = settledAt(3 * TILE_SIZE);
    const tapApex = jumpApex(start, 3);
    const heldApex = jumpApex(start, 100);
    const surfaceY = SURFACE - PLAYER_HEIGHT;
    expect(tapApex).toBeLessThan(surfaceY);
    expect(heldApex).toBeLessThan(surfaceY);
    expect(surfaceY - heldApex).toBeGreaterThan((surfaceY - tapApex) * 1.5);
  });

  it('clears the tallest climb the generator hands out, and no more', () => {
    const rise =
      SURFACE - PLAYER_HEIGHT - jumpApex(settledAt(3 * TILE_SIZE), 100);
    expect(rise).toBeGreaterThan((MAX_JUMP_TILES - 1) * TILE_SIZE);
    expect(rise).toBeLessThan(MAX_JUMP_TILES * TILE_SIZE);
  });

  it('stacks speed items and caps the bonus at 15%', () => {
    const base = capabilitiesFor([]);
    const one = capabilitiesFor([item('BOOTS', { kind: 'SPEED', percent: 3 })]);
    expect(one.x.max).toBeCloseTo(base.x.max * 1.03, 5);

    const two = capabilitiesFor([
      item('BOOTS', { kind: 'SPEED', percent: 3 }),
      item('SKIMMERS', { kind: 'SPEED', percent: 5 }),
    ]);
    expect(two.x.max).toBeCloseTo(base.x.max * 1.08, 5);

    const overCap = capabilitiesFor([
      item('A', { kind: 'SPEED', percent: 7 }),
      item('B', { kind: 'SPEED', percent: 7 }),
      item('C', { kind: 'SPEED', percent: 7 }),
    ]);
    expect(overCap.x.max).toBeCloseTo(
      base.x.max * (1 + MAX_SPEED_BONUS_PERCENT / 100),
      5,
    );
    expect(overCap.y.max).toBe(base.y.max);
  });
});

describe('key and chest', () => {
  it('collects the key by walking over it', () => {
    let state = settledAt(13 * TILE_SIZE);
    expect(state.hasKey).toBe(false);
    state = act(state, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, 120);
    expect(state.hasKey).toBe(true);
  });

  it('keeps the chest locked without the key', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    expect(state.isNearChest).toBe(true);
    expect(state.hasKey).toBe(false);
    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('PLAYING');
    expect(state.inventory).toHaveLength(0);
  });

  it('opens the chest with the key, takes one card, then stays opened', () => {
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

  it('INTERACT confirms the open chest by taking the first card', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('CHEST');

    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('PLAYING');
    expect(state.isChestOpened).toBe(true);
    expect(state.inventory.map((i) => i.id)).toEqual(['CARD-0']);
  });

  it('CLOSE leaves the chest unopened so it can be reopened later', () => {
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

  it('ignores CHOOSE_ITEM with an invalid index', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    const unchanged = act(state, { type: 'CHOOSE_ITEM', index: 99 });
    expect(unchanged).toEqual(state);
  });
});

describe('portal and level loading', () => {
  it('completes the level through the portal, even without the key', () => {
    let state = settledAt(25 * TILE_SIZE - 10);
    expect(state.isNearPortal).toBe(true);
    state = act(state, { type: 'INTERACT' });
    expect(state.status).toBe('COMPLETE');
    expect(tick(state)).toEqual(state);
  });

  it('LOAD_LEVEL starts fresh but keeps the inventory', () => {
    let state = settledAt(20 * TILE_SIZE - 20);
    state = { ...state, hasKey: true };
    state = act(state, { type: 'INTERACT' });
    state = act(state, { type: 'CHOOSE_ITEM', index: 3 });
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: testLevel(),
      levelIndex: 1,
    });

    expect(state.levelIndex).toBe(1);
    expect(state.status).toBe('PLAYING');
    expect(state.hasKey).toBe(false);
    expect(state.isChestOpened).toBe(false);
    expect(state.time).toBe(0);
    expect(state.player.position.x).toBe(SPAWN_X);
    expect(state.inventory.map((i) => i.id)).toEqual(['CARD-3']);
  });
});

describe('enemies', () => {
  const enemySpawn: Point = { x: 5, y: 11 };
  const floorEnemyY = SURFACE - ENEMY_HEIGHT;

  const withEnemy = (): GameState =>
    createInitialState(testLevel([enemySpawn]), 0, []);

  it('paces back and forth, turning at walls and platform edges without falling', () => {
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

  it('hops when the player is overhead — and lower than the player jumps', () => {
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

    expect(ENEMY_JUMP_VELOCITY).toBeLessThan(capabilitiesFor([]).y.max);
  });

  it('ignores the player alongside it, only reacting to one overhead', () => {
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

  it('is gone for good once it drops into the pit — enemies never respawn', () => {
    let state = withEnemy();
    state = tickN(state, 5);
    expect(
      state.enemies,
      'the enemy is on the floor to begin with',
    ).toHaveLength(1);

    // drop it over the pit the level carves at columns 10 and 11
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

  it('does not bring enemies back when the player respawns', () => {
    let state = withEnemy();
    state = tickN(state, 5);
    const enemyX = state.enemies[0].position.x;

    state = act(state, { type: 'RESPAWN' });
    expect(state.player.position.x, 'the player went back to spawn').toBe(
      SPAWN_X,
    );
    expect(state.enemies, 'the enemy is still there').toHaveLength(1);
    expect(state.enemies[0].position.x, 'and did not move').toBe(enemyX);
  });

  it('spawns the new levels enemies on LOAD_LEVEL', () => {
    let state = withEnemy();
    expect(state.enemies).toHaveLength(1);
    state = act(state, {
      type: 'LOAD_LEVEL',
      level: testLevel([enemySpawn, enemySpawn]),
      levelIndex: 1,
    });
    expect(state.enemies).toHaveLength(2);
  });

  const withSpike = (col: number, enemies: Point[] = []): Level => {
    const level = testLevel(enemies);
    level.tiles[11][col] = TILE_SPIKE;
    return level;
  };

  it('a spike costs a heart and grants invincibility instead of killing', () => {
    let state = createInitialState(withSpike(6), 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 6 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    expect(state.player.hearts.value).toBe(1);
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'the prick drains a heart').toBe(0);
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

  it('a spike at zero hearts is fatal and sends the player back to spawn', () => {
    let state = createInitialState(withSpike(6), 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 6 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
        hearts: { value: 0 },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'cannot drop below zero').toBe(0);
    expect(
      state.player.timers.death,
      'with no hearts left the prick is lethal',
    ).not.toBeNull();
    expect(state.deaths, 'and it counts as a death').toBe(before + 1);

    state = tickN(state, 120);
    expect(state.player.position.x, 'respawned at spawn').toBe(SPAWN_X);
    expect(state.player.timers.death, 'back on their feet').toBeNull();
  });

  it('ignores input while the player is dying from a pit fall', () => {
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

  it('turns enemies back at a spike and keeps them alive', () => {
    let state = createInitialState(withSpike(9, [enemySpawn]), 0, []);
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

  it('kills an enemy that ends up on a spike, clearing it once it fades', () => {
    let state = createInitialState(withSpike(5, [enemySpawn]), 0, []);
    expect(state.enemies).toHaveLength(1);
    state = tick(state);
    expect(state.enemies, 'lingers while it fades').toHaveLength(1);
    expect(state.enemies[0].timers.death).toBe(0);
    expect(state.enemies[0].velocity.x.current, 'stops dead').toBe(0);

    state = tickN(state, ticksFor(ENEMY_DEATH_SECONDS));
    expect(state.enemies).toHaveLength(0);
  });

  it('lets the player walk through a dying enemy unharmed', () => {
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

  it('an enemy costs a heart and leaves the player standing but invincible', () => {
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
    expect(state.player.hearts.value, 'the bump drains a heart').toBe(0);
    expect(state.player.timers.invincibility).toBeGreaterThan(0);
    expect(state.player.timers.death, 'no death, no respawn').toBeNull();
    expect(state.player.position.x, 'and no knockback').toBe(restingX);
    expect(state.deaths).toBe(before);
  });

  it('an enemy at zero hearts kills the player and respawns them', () => {
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
        hearts: { value: 0 },
      },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.player.hearts.value, 'stays clamped at zero').toBe(0);
    expect(
      state.player.timers.death,
      'with no hearts left the bump is lethal',
    ).not.toBeNull();
    expect(state.deaths).toBe(before + 1);

    state = tickN(state, 120);
    expect(state.player.position.x, 'respawned at spawn').toBe(SPAWN_X);
    expect(state.player.timers.death, 'back on their feet').toBeNull();
  });

  it('does not kill a player kept apart by the pit', () => {
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

  it('spares a player only grazing an enemy, when the drawn bodies never touch', () => {
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
});

const spikeLevel = (col: number): Level => {
  const level = testLevel();
  level.tiles[11][col] = TILE_SPIKE;
  return level;
};

const ceilingSpikeLevel = (col: number, row: number): Level => {
  const level = testLevel();
  level.tiles[row - 1][col] = TILE_DIRT;
  level.tiles[row][col] = TILE_SPIKE_CEILING;
  return level;
};

describe('ceiling spikes', () => {
  const col = 6;
  const row = 9;

  it('costs a heart when the player jumps up into the prongs', () => {
    let state = createInitialState(ceilingSpikeLevel(col, row), 0, []);
    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: col * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    state = tick(state);
    expect(state.player.hearts.value, 'safe while standing underneath').toBe(1);

    state = act(state, { type: 'JUMP_START' });
    state = tickN(state, 20);
    expect(state.player.hearts.value, 'the jump ran into the prongs').toBe(0);
    expect(state.player.timers.invincibility).toBeGreaterThan(0);
    expect(
      state.player.timers.death,
      'a prong is not fatal on its own',
    ).toBeNull();
  });

  it('spares the player who stays under the prongs', () => {
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

  it('is not triggered by the clear air above the prongs', () => {
    const level = spikeLevel(col);
    expect(overlapsSpike(level, left, 11 * TILE_SIZE, TILE_SIZE, 6)).toBe(
      false,
    );
  });

  it('is triggered when the box reaches down into the prongs', () => {
    const level = spikeLevel(col);
    expect(overlapsSpike(level, left, 11 * TILE_SIZE + 23, TILE_SIZE, 6)).toBe(
      true,
    );
  });

  it('is not triggered in the notch between two prongs', () => {
    const level = spikeLevel(col);
    expect(overlapsSpike(level, left + 8, 11 * TILE_SIZE + 9, 5, 6)).toBe(
      false,
    );
  });
});

describe('lone spikes', () => {
  const col = 6;
  const left = col * TILE_SIZE;
  // The left third of the tile, from the ground up to the prong tips.
  const edgeBox = (level: Level, tileLeft: number): boolean =>
    overlapsSpike(level, tileLeft + 1, 11 * TILE_SIZE + 8, 8, TILE_SIZE - 8);

  it('leaves the tile edges clear when nothing sits beside it', () => {
    expect(edgeBox(spikeLevel(col), left)).toBe(false);
  });

  it('still fills the tile when another spike sits beside it', () => {
    const level = spikeLevel(col);
    level.tiles[11][col + 1] = TILE_SPIKE;
    expect(edgeBox(level, left)).toBe(true);
  });

  it('does not pair a floor spike with a ceiling spike beside it', () => {
    const level = spikeLevel(col);
    level.tiles[11][col + 1] = TILE_SPIKE_CEILING;
    expect(edgeBox(level, left)).toBe(false);
  });

  it('is still lethal head on', () => {
    expect(
      overlapsSpike(spikeLevel(col), left, 11 * TILE_SIZE + 23, TILE_SIZE, 6),
    ).toBe(true);
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

  it('starts a new level with a single heart', () => {
    expect(createInitialState(testLevel(), 0, []).player.hearts.value).toBe(1);
  });

  it('collecting a chest heart adds a heart on the spot', () => {
    let state = createInitialState(testLevel(), 0, []);
    expect(state.player.hearts.value).toBe(1);

    state = {
      ...state,
      status: 'CHEST',
      level: { ...state.level, chestItems: [emberHeart()] },
    };
    state = act(state, { type: 'CHOOSE_ITEM', index: 0 });
    expect(
      state.player.hearts.value,
      'the collected heart lands immediately',
    ).toBe(2);
    expect(state.inventory).toHaveLength(1);
  });

  it('carries hearts to the next level without topping them back up', () => {
    let state = createInitialState(testLevel(), 0, [emberHeart()]);
    expect(state.player.hearts.value, 'base plus one collected').toBe(2);

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

  it('spends one heart on a pit fall but respawns with the rest', () => {
    let state = createInitialState(testLevel(), 0, [
      emberHeart('H1'),
      emberHeart('H2'),
    ]);
    expect(state.player.hearts.value).toBe(3);

    state = {
      ...state,
      player: {
        ...state.player,
        position: { x: 10 * TILE_SIZE + 5, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    state = tickN(state, 120);
    expect(state.player.position.x, 'respawned at spawn').toBe(SPAWN_X);
    expect(state.player.hearts.value, 'down just one heart').toBe(2);
    expect(state.deaths).toBe(1);
  });

  it('shrugs off hits while invincible, then is vulnerable once it lapses', () => {
    let state = placeAt(
      createInitialState(spikeLevel(6), 0, [emberHeart()]),
      spikeX,
    );
    expect(state.player.hearts.value).toBe(2);

    state = tick(state);
    expect(state.player.hearts.value, 'the spike takes one heart').toBe(1);
    const granted = state.player.timers.invincibility;
    expect(granted).toBeGreaterThan(0);

    state = tick(placeAt(state, spikeX));
    expect(
      state.player.hearts.value,
      'a second bite bounces off the i-frames',
    ).toBe(1);
    expect(
      state.player.timers.invincibility,
      'and the timer keeps ticking',
    ).toBeLessThan(granted);

    state = tickN(placeAt(state, safeX), ticksFor(INVINCIBLE_SECONDS));
    expect(
      state.player.timers.invincibility,
      'invincibility has worn off',
    ).toBe(0);
    expect(state.player.hearts.value, 'no damage taken while safe').toBe(1);

    state = tick(placeAt(state, spikeX));
    expect(state.player.hearts.value, 'the spike bites once more').toBe(0);
    expect(state.player.timers.invincibility).toBeGreaterThan(0);
  });

  it('lets a stockpile of hearts soak up several hits, the last one fatal', () => {
    let state = placeAt(
      createInitialState(spikeLevel(6), 0, [
        emberHeart('H1'),
        emberHeart('H2'),
      ]),
      spikeX,
    );
    expect(state.player.hearts.value, 'base plus two collected').toBe(3);
    const deaths = state.deaths;

    for (let heartsLeft = 2; heartsLeft >= 0; heartsLeft--) {
      state = tick(placeAt(state, spikeX));
      expect(state.player.hearts.value).toBe(heartsLeft);
      expect(state.player.timers.death, 'still alive').toBeNull();
      state = tickN(placeAt(state, safeX), ticksFor(INVINCIBLE_SECONDS));
    }
    expect(state.deaths, 'survived every hit').toBe(deaths);

    state = tick(placeAt(state, spikeX));
    expect(state.player.hearts.value, 'cannot drop below zero').toBe(0);
    expect(
      state.player.timers.death,
      'the hit that finds an empty bar is fatal',
    ).not.toBeNull();
    expect(state.deaths, 'and counts as a death').toBe(deaths + 1);
  });
});
