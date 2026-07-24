import {
  createRng,
  type Item,
  type Level,
  MAX_JUMP_TILES,
  type Point,
  rollPalette,
  type Tile,
  TILE_EMPTY,
  TILE_SIZE,
  TILE_SOLID,
  TILE_SPIKE,
} from '@mander/generator';
import { describe, expect, it } from 'vitest';

import type { Action } from './actions';
import { overlapsSpike } from './physics';
import { reduce } from './reducer';
import {
  capabilitiesFor,
  createInitialState,
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_WIDTH,
  type GameState,
  MAX_SPEED_BONUS_PERCENT,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
} from './state';

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
    const fillTile: Tile = y >= 12 ? TILE_SOLID : TILE_EMPTY;
    const row: Tile[] = Array.from({ length: WIDTH }, () => fillTile);
    row[0] = TILE_SOLID;
    row[WIDTH - 1] = TILE_SOLID;
    tiles.push(row);
  }
  for (let y = 12; y < HEIGHT; y++) {
    tiles[y][10] = TILE_EMPTY;
    tiles[y][11] = TILE_EMPTY;
  }
  return {
    seed: 'TEST',
    width: WIDTH,
    height: HEIGHT,
    tiles,
    spawn: { x: 2 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
    chest: { x: 20 * TILE_SIZE, y: SURFACE - 22, width: 26, height: 22 },
    portal: { x: 25 * TILE_SIZE, y: SURFACE - 64, width: 40, height: 64 },
    key: { x: 15 * TILE_SIZE + 7, y: SURFACE - 34, width: 18, height: 22 },
    chestItems: CARDS,
    enemies,
    palette: rollPalette(createRng('TEST')),
  };
};

const DELTA_SECONDS = 1 / 60;

const act = (state: GameState, action: Action) => reduce(state, action);
const tick = (state: GameState) =>
  reduce(state, { type: 'TICK', deltaSeconds: DELTA_SECONDS });

const tickN = (state: GameState, n: number): GameState => {
  let next = state;
  for (let i = 0; i < n; i++) next = tick(next);
  return next;
};

const settledAt = (x: number, inventory: Item[] = []): GameState => {
  const state = createInitialState(testLevel(), 0, inventory);
  state.player.x = x;
  state.player.y = SURFACE - PLAYER_HEIGHT;
  return tick(state);
};

const jumpApex = (start: GameState, holdTicks: number): number => {
  let state = act(start, { type: 'JUMP_START' });
  let apex = state.player.y;
  for (let i = 0; i < 300; i++) {
    if (i === holdTicks) state = act(state, { type: 'JUMP_STOP' });
    state = tick(state);
    apex = Math.min(apex, state.player.y);
    if (state.player.isGrounded && i > 2) break;
  }
  return apex;
};

describe('movement actions', () => {
  it('applies gravity until the player lands', () => {
    let state = createInitialState(testLevel(), 0, []);
    expect(state.player.isGrounded).toBe(false);
    state = tickN(state, 60);
    expect(state.player.isGrounded).toBe(true);
    expect(state.player.y).toBe(SURFACE - PLAYER_HEIGHT);
    expect(state.player.vy).toBe(0);
  });

  it('moves with MOVE_RIGHT_START and stops with MOVE_RIGHT_STOP', () => {
    const start = settledAt(3 * TILE_SIZE);
    let state = act(start, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, 10);
    expect(state.player.x).toBeGreaterThan(start.player.x);
    expect(state.player.facing).toBe(1);

    const movedX = state.player.x;
    state = act(state, { type: 'MOVE_RIGHT_STOP' });
    state = tickN(state, 5);
    expect(state.player.x).toBe(movedX);
  });

  it('is stopped by walls when moving left', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'MOVE_LEFT_START' });
    state = tickN(state, 600);
    expect(state.player.x).toBe(TILE_SIZE);
    expect(state.player.vx).toBe(0);
    expect(state.player.facing).toBe(-1);
  });

  it('is too tall to squeeze under a ceiling one tile above the ground', () => {
    const level = testLevel();
    level.tiles[10][6] = TILE_SOLID;
    let state = createInitialState(level, 0, []);
    state = {
      ...state,
      player: { ...state.player, x: 3 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
    };
    state = act(state, { type: 'MOVE_RIGHT_START' });
    state = tickN(state, 120);
    expect(state.player.x + PLAYER_WIDTH).toBeLessThanOrEqual(6 * TILE_SIZE);
  });

  it('respawns and counts a death after falling into the pit', () => {
    const start = settledAt(8 * TILE_SIZE);
    start.player.x = 10 * TILE_SIZE + 5;
    const state = tickN(start, 120);
    expect(state.deaths).toBe(1);
    expect(state.player.x).toBe(state.level.spawn.x);
  });

  it('RESPAWN resets the player position but keeps key and inventory', () => {
    let state = settledAt(15 * TILE_SIZE, [item('EXTRA')]);
    state = tickN(state, 2);
    expect(state.hasKey).toBe(true);
    state = act(state, { type: 'RESPAWN' });
    expect(state.player.x).toBe(state.level.spawn.x);
    expect(state.hasKey).toBe(true);
    expect(state.inventory).toHaveLength(1);
  });
});

describe('jumping', () => {
  it('jumps on JUMP_START only when grounded — there is no double jump', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    expect(state.player.vy).toBeLessThan(0);
    expect(state.player.isGrounded).toBe(false);

    state = act(state, { type: 'JUMP_STOP' });
    const risingVy = state.player.vy;
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    expect(state.player.vy).toBeGreaterThan(risingVy);
    expect(state.player.vy).toBeLessThan(0);
  });

  it('ignores held-key repeats of JUMP_START', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    const rising = state.player.vy;
    state = act(state, { type: 'JUMP_START' });
    state = tick(state);
    expect(state.player.vy).toBeGreaterThan(rising);
    expect(state.player.vy).toBeLessThan(0);
  });

  it('re-jumps on landing while the jump button stays held', () => {
    let state = settledAt(3 * TILE_SIZE);
    state = act(state, { type: 'JUMP_START' });
    let hasLanded = false;
    let hasRejumped = false;
    for (let i = 0; i < 200; i++) {
      state = tick(state);
      if (state.player.isGrounded) hasLanded = true;
      else if (hasLanded && state.player.vy < 0) {
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
    expect(one.moveSpeed).toBeCloseTo(base.moveSpeed * 1.03, 5);

    const two = capabilitiesFor([
      item('BOOTS', { kind: 'SPEED', percent: 3 }),
      item('SKIMMERS', { kind: 'SPEED', percent: 5 }),
    ]);
    expect(two.moveSpeed).toBeCloseTo(base.moveSpeed * 1.08, 5);

    const overCap = capabilitiesFor([
      item('A', { kind: 'SPEED', percent: 7 }),
      item('B', { kind: 'SPEED', percent: 7 }),
      item('C', { kind: 'SPEED', percent: 7 }),
    ]);
    expect(overCap.moveSpeed).toBeCloseTo(
      base.moveSpeed * (1 + MAX_SPEED_BONUS_PERCENT / 100),
      5,
    );
    expect(overCap.jumpVelocity).toBe(base.jumpVelocity);
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
    expect(state.player.x).toBe(state.level.spawn.x);
    expect(state.inventory.map((i) => i.id)).toEqual(['CARD-3']);
  });
});

describe('enemies', () => {
  const enemySpawn: Point = { x: 5 * TILE_SIZE, y: 11 * TILE_SIZE };
  const floorEnemyY = SURFACE - ENEMY_HEIGHT;

  const withEnemy = (): GameState =>
    createInitialState(testLevel([enemySpawn]), 0, []);

  it('paces back and forth, turning at walls and platform edges without falling', () => {
    let state = withEnemy();
    const facings = new Set<number>();
    let minX = Infinity;
    let maxX = -Infinity;
    for (let i = 0; i < 500; i++) {
      state = tick(state);
      const enemy = state.enemies[0];
      expect(enemy.isGrounded, `isGrounded at tick ${i}`).toBe(true);
      expect(enemy.y, `on the floor at tick ${i}`).toBe(floorEnemyY);
      facings.add(enemy.facing);
      minX = Math.min(minX, enemy.x);
      maxX = Math.max(maxX, enemy.x);
    }
    expect(facings.has(1) && facings.has(-1), 'turned around both ways').toBe(
      true,
    );
    expect(maxX - minX, 'actually paced a distance').toBeGreaterThan(TILE_SIZE);
  });

  it('hops when the player is overhead — and lower than the player jumps', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    expect(enemy.isGrounded).toBe(true);

    state = {
      ...state,
      player: {
        ...state.player,
        x: enemy.x,
        y: enemy.y - 3 * TILE_SIZE,
        vy: 0,
      },
    };
    state = tick(state);
    expect(state.enemies[0].vy, 'the enemy launched upward').toBeLessThan(0);

    expect(ENEMY_JUMP_VELOCITY).toBeLessThan(capabilitiesFor([]).jumpVelocity);
  });

  it('ignores the player alongside it, only reacting to one overhead', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: { ...state.player, x: enemy.x + ENEMY_WIDTH, y: enemy.y, vy: 0 },
    };
    state = tick(state);
    expect(state.enemies[0].isGrounded, 'did not hop from mere proximity').toBe(
      true,
    );
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

  it('kills the player who walks into a spike', () => {
    let state = createInitialState(withSpike(6), 0, []);
    state = {
      ...state,
      player: { ...state.player, x: 6 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.deaths).toBe(before + 1);
    expect(state.player.x).toBe(state.level.spawn.x);
  });

  it('turns enemies back at a spike and keeps them alive', () => {
    let state = createInitialState(withSpike(9, [enemySpawn]), 0, []);
    let maxRight = 0;
    for (let i = 0; i < 400; i++) {
      state = tick(state);
      expect(state.enemies, `alive at tick ${i}`).toHaveLength(1);
      maxRight = Math.max(maxRight, state.enemies[0].x + ENEMY_WIDTH);
    }
    expect(maxRight, 'paced toward the spike').toBeGreaterThan(7 * TILE_SIZE);
    expect(maxRight, 'never reached the spike column').toBeLessThanOrEqual(
      9 * TILE_SIZE,
    );
  });

  it('kills an enemy that ends up on a spike', () => {
    let state = createInitialState(withSpike(5, [enemySpawn]), 0, []);
    expect(state.enemies).toHaveLength(1);
    state = tick(state);
    expect(state.enemies).toHaveLength(0);
  });

  it('kills the player on contact, respawning and counting a death', () => {
    let state = withEnemy();
    for (let i = 0; i < 10; i++) state = tick(state);
    const enemy = state.enemies[0];
    state = {
      ...state,
      player: { ...state.player, x: enemy.x, y: enemy.y, vy: 0 },
    };
    const before = state.deaths;
    state = tick(state);
    expect(state.deaths).toBe(before + 1);
    expect(state.player.x).toBe(state.level.spawn.x);
    expect(state.player.y).toBe(state.level.spawn.y);
  });

  it('does not kill a player kept apart by the pit', () => {
    let state = withEnemy();
    state = {
      ...state,
      player: {
        ...state.player,
        x: 15 * TILE_SIZE,
        y: SURFACE - PLAYER_HEIGHT,
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
        x: px,
        y: SURFACE - PLAYER_HEIGHT,
        vx: 0,
        vy: 0,
        isGrounded: true,
      },
      enemies: [
        {
          x: px + 17,
          y: enemyFloorY,
          vx: 0,
          vy: 0,
          facing: 1,
          isGrounded: true,
          homeX: px + 17,
          homeY: enemyFloorY,
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
