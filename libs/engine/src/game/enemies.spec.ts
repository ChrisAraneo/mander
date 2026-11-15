import {
  type Enemy,
  type EnemyKind,
  type Item,
  type Tile,
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_ENEMY,
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
  includes,
  isNull,
  map,
  maxBy,
  minBy,
  reduce,
  size,
  some,
  times,
} from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { CANNON_RELOAD_SECONDS } from '../cannon/consts';
import {
  ENEMY_DEATH_SECONDS,
  ENEMY_HEIGHT,
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  ENEMY_WIDTH,
  FAST_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_CHANCE,
  HORNED_ENEMY_JUMP_VELOCITY,
  SHOOTER_ENEMY_MOVE_SPEED,
  SHOOTER_RANGE,
  SHOOTER_RELOAD_SECONDS,
} from '../enemy/consts';
import { FIRST_LEVEL_INDEX } from '../load-level/consts';
import { computeSpawnPosition } from '../player/compute-spawn-position';
import {
  BASE_HEARTS,
  HURT_INVINCIBLE_SECONDS,
  PLAYER_HEIGHT,
  STOMP_BOUNCE_VELOCITY,
} from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { createInitialState } from '../start/create-initial-state';
import { removeUpdateTime } from '../state/remove-update-time';
import type { GameLevel } from '../state/types/game-level';
import type { GameState } from '../state/types/game-state';
import { nextGameState } from './next-game-state';

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

const FLOOR_ROW = 12;

const SURFACE = FLOOR_ROW * TILE_SIZE;

const DELTA_SECONDS = 1 / 60;

const ENEMY_SPAWN_COLUMN = 5;

const ENEMY_SPAWN_ROW = FLOOR_ROW - 1;

const FLYING_ENEMY_SPAWN_ROW = 5;

const SPIKE_ROW = FLOOR_ROW - 1;

const SPIKE_COLUMN = 9;

const SECOND_ENEMY_SPAWN_COLUMN = 7;

const SPIKE_TRAP_COLUMN = 5;

const BEFORE_SPIKE_COLUMN = 7;

const PIT_COLUMN = 10;

const PIT_ENEMY_OFFSET = 4;

const PIT_PLAYER_OFFSET = 5;

const PLAYER_COLUMN = 6;

const SETTLE_TICKS = 10;

const PACE_TICKS = 5;

const CORPSE_TICKS = 4;

const TWO_SECOND_TICKS = 120;

const FALL_TICKS = 300;

const LONG_PACE_TICKS = 400;

const FULL_PACE_TICKS = 500;

const DIVE_SPEED = 1000;

const PLAYER_FALL_SPEED = 400;

const ENEMY_FALL_SPEED = 200;

const HEAD_OVERLAP = 1;

const HEAD_ON_OVERLAP = 9;

const WIDEST_CLIPPING_OFFSET = 17;

const DROP_GAP = 10;

interface SpawnCell {
  column: number;
  row: number;
}

const ENEMY_SPAWN: SpawnCell = {
  column: ENEMY_SPAWN_COLUMN,
  row: ENEMY_SPAWN_ROW,
};

const FLYING_ENEMY_SPAWN: SpawnCell = {
  column: ENEMY_SPAWN_COLUMN,
  row: FLYING_ENEMY_SPAWN_ROW,
};

const SECOND_ENEMY_SPAWN: SpawnCell = {
  column: SECOND_ENEMY_SPAWN_COLUMN,
  row: ENEMY_SPAWN_ROW,
};

const FLOOR_ENEMY_Y = SURFACE - ENEMY_HEIGHT;

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

const createTestLevel = (enemies: SpawnCell[] = []): GameLevel => ({
  seed: 'TEST',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row, rowIndex) =>
    map(row, (symbol, columnIndex) =>
      match(
        some(
          enemies,
          (spawn) => spawn.column === columnIndex && spawn.row === rowIndex,
        ),
      )
        .with(true, () => TILE_ENEMY)
        .otherwise(() => LEGEND[symbol]),
    ),
  ),
  chestItems: CARDS,
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const SPAWN_X = computeSpawnPosition(createTestLevel()).x;

const createSpikeLevel = (
  column: number,
  enemies: SpawnCell[] = [],
): GameLevel =>
  pipe(enemies, createTestLevel, (level): GameLevel => ({
    ...level,
    tiles: map(level.tiles, (row, rowIndex) =>
      map(row, (tile, columnIndex) =>
        match(rowIndex === SPIKE_ROW && columnIndex === column)
          .with(true, () => TILE_SPIKE)
          .otherwise(() => tile),
      ),
    ),
  }));

const nextTick = (state: GameState): GameState =>
  nextGameState(state, { type: 'TICK' }, constant(0));

const nextTicks = (state: GameState, tickCount: number): GameState =>
  reduce(times(tickCount), (current) => nextTick(current), state);

const nextTicksWhile = (
  state: GameState,
  tickLimit: number,
  isTicking: (state: GameState) => boolean,
): GameState =>
  match(tickLimit > 0 && isTicking(state))
    .with(true, () => nextTicksWhile(nextTick(state), tickLimit - 1, isTicking))
    .otherwise(() => state);

const nextTickStates = (state: GameState, tickCount: number): GameState[] =>
  match(tickCount > 0)
    .with(true, () =>
      pipe(state, nextTick, (ticked) => [
        ticked,
        ...nextTickStates(ticked, tickCount - 1),
      ]),
    )
    .otherwise((): GameState[] => []);

const computeTickCount = (seconds: number): number =>
  ceil(seconds / DELTA_SECONDS) + 1;

const createSettledState = (left: number, inventory: Item[] = []): GameState =>
  pipe(
    createInitialState(createTestLevel(), FIRST_LEVEL_INDEX, inventory),
    (state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: left, y: SURFACE - PLAYER_HEIGHT },
      },
    }),
    nextTick,
  );

const patchEnemyKinds = (
  state: GameState,
  kind: EnemyKind,
  moveSpeed: number,
  jumpVelocity: number,
): GameState => ({
  ...state,
  enemies: map(state.enemies, (enemy): Enemy => ({
    ...enemy,
    kind,
    velocity: {
      x: { ...enemy.velocity.x, max: moveSpeed },
      y: { ...enemy.velocity.y, max: jumpVelocity },
    },
  })),
});

const patchHoppingEnemies = (state: GameState): GameState =>
  patchEnemyKinds(state, 'HOPPING', ENEMY_MOVE_SPEED, ENEMY_JUMP_VELOCITY);

const patchFastEnemies = (state: GameState): GameState =>
  patchEnemyKinds(
    state,
    'FAST',
    FAST_ENEMY_MOVE_SPEED,
    HORNED_ENEMY_JUMP_VELOCITY,
  );

const patchShooterEnemies = (state: GameState): GameState =>
  pipe(
    patchEnemyKinds(
      state,
      'SHOOTER',
      SHOOTER_ENEMY_MOVE_SPEED,
      HORNED_ENEMY_JUMP_VELOCITY,
    ),
    (patched): GameState => ({
      ...patched,
      enemies: map(patched.enemies, (enemy): Enemy => ({
        ...enemy,
        timers: { ...enemy.timers, reload: SHOOTER_RELOAD_SECONDS },
      })),
    }),
  );

const createShooterEnemyState = (playerLeft: number): GameState =>
  pipe(
    createInitialState(createTestLevel([ENEMY_SPAWN]), 0, []),
    patchShooterEnemies,
    (state): GameState => ({
      ...state,
      player: {
        ...state.player,
        position: { x: playerLeft, y: SURFACE - PLAYER_HEIGHT },
      },
    }),
  );

const createHoppingEnemyState = (): GameState =>
  patchHoppingEnemies(
    createInitialState(createTestLevel([ENEMY_SPAWN]), 0, []),
  );

const createFlyingEnemyState = (): GameState =>
  createInitialState(createTestLevel([FLYING_ENEMY_SPAWN]), 0, []);

describe('enemies', () => {
  it('should turn the enemy back when it paces into a wall or a platform edge', () => {
    const start = createHoppingEnemyState();
    const enemies = map(
      nextTickStates(start, FULL_PACE_TICKS),
      (state) => state.enemies[0],
    );

    times(size(enemies), (tickIndex) =>
      expect(
        enemies[tickIndex].statuses.isGrounded,
        `isGrounded at tick ${tickIndex}`,
      ).toBe(true),
    );
    times(size(enemies), (tickIndex) =>
      expect(
        enemies[tickIndex].position.y,
        `on the floor at tick ${tickIndex}`,
      ).toBe(FLOOR_ENEMY_Y),
    );

    const facings = map(enemies, (enemy) => enemy.statuses.isFacingRight);
    const minX = minBy(enemies, (enemy) => enemy.position.x)?.position.x ?? 0;
    const maxX = maxBy(enemies, (enemy) => enemy.position.x)?.position.x ?? 0;

    expect(
      includes(facings, true) && includes(facings, false),
      'turned around both ways',
    ).toBe(true);
    expect(maxX - minX, 'actually paced a distance').toBeGreaterThan(TILE_SIZE);
  });

  it('should hop, and lower than the player jumps, when the player is overhead', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];

    expect(enemy.statuses.isGrounded).toBe(true);

    const overhead = {
      ...settled,
      player: {
        ...settled.player,
        position: { x: enemy.position.x, y: enemy.position.y - 3 * TILE_SIZE },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: 0 },
        },
      },
    };
    const ticked = nextTick(overhead);

    expect(
      ticked.enemies[0].velocity.y.current,
      'the enemy launched upward',
    ).toBeLessThan(0);
    expect(ENEMY_JUMP_VELOCITY).toBeLessThan(createBasePlayerVelocity().y.max);
  });

  it('should ignore the player when they stand alongside it rather than overhead', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const alongside = {
      ...settled,
      player: {
        ...settled.player,
        position: { x: enemy.position.x + ENEMY_WIDTH, y: enemy.position.y },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: 0 },
        },
      },
    };
    const ticked = nextTick(alongside);

    expect(
      ticked.enemies[0].statuses.isGrounded,
      'did not hop from mere proximity',
    ).toBe(true);
  });

  it('should be gone for good when the enemy drops into the pit', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, PACE_TICKS);

    expect(
      settled.enemies,
      'the enemy is on the floor to begin with',
    ).toHaveLength(1);

    const dropped = {
      ...settled,
      enemies: [
        {
          ...settled.enemies[0],
          position: {
            x: PIT_COLUMN * TILE_SIZE + PIT_ENEMY_OFFSET,
            y: FLOOR_ENEMY_Y,
          },
          statuses: { ...settled.enemies[0].statuses, isGrounded: false },
        },
      ],
    };
    const fallen = nextTicks(dropped, FALL_TICKS);

    expect(
      fallen.enemies,
      'it fell out of the world and stayed out',
    ).toHaveLength(0);
  });

  it('should reset every enemy to its own spawn point when the player respawns', () => {
    const start = createHoppingEnemyState();
    const enemySpawnPosition = start.enemies[0].spawn;
    const paced = nextTicks(start, PACE_TICKS);

    expect(
      paced.enemies[0].position.x,
      'paced away from its spawn by now',
    ).not.toBe(enemySpawnPosition.x);

    const respawned = nextGameState(paced, { type: 'RESPAWN' }, constant(0));

    expect(respawned.player.position.x, 'the player went back to spawn').toBe(
      SPAWN_X,
    );
    expect(respawned.enemies, 'still exactly one enemy').toHaveLength(1);
    expect(
      respawned.enemies[0].position,
      'and it is back at its own spawn point too',
    ).toEqual(enemySpawnPosition);
  });

  it('should respawn every enemy too when the player auto-respawns after a pit fall', () => {
    const start = createHoppingEnemyState();
    const enemySpawnPosition = start.enemies[0].spawn;
    const paced = nextTicks(start, PACE_TICKS);
    const pushed = {
      ...paced,
      player: {
        ...paced.player,
        position: {
          x: PIT_COLUMN * TILE_SIZE + PIT_PLAYER_OFFSET,
          y: SURFACE - PLAYER_HEIGHT,
        },
      },
    };
    const dying = nextTicksWhile(pushed, FALL_TICKS, (state) =>
      isNull(state.player.timers.death),
    );

    expect(
      dying.player.timers.death,
      'the fall started the death throes',
    ).not.toBeNull();

    const respawned = nextTicksWhile(
      dying,
      FALL_TICKS,
      (state) => !isNull(state.player.timers.death),
    );

    expect(
      respawned.player.timers.death,
      'and the respawn completed',
    ).toBeNull();
    expect(respawned.player.position.x, 'respawned at spawn').toBe(SPAWN_X);
    expect(respawned.enemies, 'still exactly one enemy').toHaveLength(1);
    expect(
      respawned.enemies[0].position,
      'the enemy reset to its own spawn point too',
    ).toEqual(enemySpawnPosition);
  });

  it('should spawn the enemies of the new level when the next level loads', () => {
    const start = createHoppingEnemyState();

    expect(start.enemies).toHaveLength(1);

    const loaded = nextGameState(
      start,
      {
        type: 'LOAD_LEVEL',
        level: createTestLevel([ENEMY_SPAWN, SECOND_ENEMY_SPAWN]),
        levelIndex: 1,
      },
      constant(0),
    );

    expect(loaded.enemies).toHaveLength(2);
  });

  it('should cost a heart and grant invincibility rather than kill when the player walks into a spike', () => {
    const start = createInitialState(createSpikeLevel(6), 0, []);
    const placed = {
      ...start,
      player: {
        ...start.player,
        position: { x: PLAYER_COLUMN * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };

    expect(placed.player.hearts.value).toBe(BASE_HEARTS);

    const before = placed.deaths;
    const ticked = nextTick(placed);

    expect(ticked.player.hearts.value, 'the prick drains a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(
      ticked.player.timers.invincibility,
      'and buys a moment of mercy',
    ).toBeGreaterThan(0);
    expect(ticked.player.timers.death, 'but stays on their feet').toBeNull();
    expect(
      ticked.player.position.x,
      'rooted in place — no knockback, no respawn',
    ).toBe(6 * TILE_SIZE);
    expect(ticked.deaths, 'a survived hit is not a death').toBe(before);
  });

  it('should end the run rather than respawn when a spike takes the last heart', () => {
    const start = createInitialState(createSpikeLevel(6), 0, []);
    const placed = {
      ...start,
      player: {
        ...start.player,
        position: { x: PLAYER_COLUMN * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
        hearts: { value: 1 },
      },
    };
    const before = placed.deaths;
    const ticked = nextTick(placed);

    expect(ticked.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(
      ticked.player.timers.death,
      'with nothing in reserve the prick is lethal',
    ).not.toBeNull();
    expect(ticked.status, 'and the run is over').toBe('GAME_OVER');
    expect(ticked.deaths, 'and it counts as a death').toBe(before + 1);

    const later = nextTicks(ticked, TWO_SECOND_TICKS);

    expect(later.player.position.x, 'there is no respawn out of it').not.toBe(
      SPAWN_X,
    );
    expect(removeUpdateTime(later), 'a finished run does not move on').toEqual(
      removeUpdateTime(ticked),
    );
  });

  it('should ignore the input when the player is dying from a pit fall', () => {
    const start = createSettledState(8 * TILE_SIZE);
    const pushed = {
      ...start,
      player: {
        ...start.player,
        position: { ...start.player.position, x: 10 * TILE_SIZE + 5 },
      },
    };
    const dying = nextTicksWhile(pushed, FALL_TICKS, (state) =>
      isNull(state.player.timers.death),
    );

    expect(
      dying.player.timers.death,
      'the fall started the death throes',
    ).not.toBeNull();

    const deaths = dying.deaths;
    const pressed = nextGameState(
      dying,
      { type: 'MOVE_RIGHT_START' },
      constant(0),
    );
    const deadX = pressed.player.position.x;
    const ticked = nextTicks(pressed, CORPSE_TICKS);

    expect(ticked.player.position.x, 'the corpse does not walk').toBe(deadX);
    expect(ticked.deaths, 'no second death mid-fall').toBe(deaths);

    const jumped = nextGameState(ticked, { type: 'JUMP_START' }, constant(0));

    expect(jumped.player.statuses.isJumpQueued).toBe(false);
  });

  it('should turn the enemy back and keep it alive when it paces into a spike', () => {
    const start = patchHoppingEnemies(
      createInitialState(createSpikeLevel(SPIKE_COLUMN, [ENEMY_SPAWN]), 0, []),
    );
    const states = nextTickStates(start, LONG_PACE_TICKS);

    times(size(states), (tickIndex) =>
      expect(
        states[tickIndex].enemies,
        `alive at tick ${tickIndex}`,
      ).toHaveLength(1),
    );

    const maxRight =
      (maxBy(states, (state) => state.enemies[0].position.x)?.enemies[0]
        .position.x ?? 0) + ENEMY_WIDTH;

    expect(maxRight, 'paced toward the spike').toBeGreaterThan(
      BEFORE_SPIKE_COLUMN * TILE_SIZE,
    );
    expect(maxRight, 'never reached the spike column').toBeLessThanOrEqual(
      SPIKE_COLUMN * TILE_SIZE,
    );
  });

  it('should turn a fast enemy back and keep it alive when it paces into a spike', () => {
    const start = patchFastEnemies(
      createInitialState(createSpikeLevel(SPIKE_COLUMN, [ENEMY_SPAWN]), 0, []),
    );
    const states = nextTickStates(start, LONG_PACE_TICKS);

    times(size(states), (tickIndex) =>
      expect(
        states[tickIndex].enemies[0].timers.death,
        `alive at tick ${tickIndex}`,
      ).toBeNull(),
    );

    const maxRight =
      (maxBy(states, (state) => state.enemies[0].position.x)?.enemies[0]
        .position.x ?? 0) + ENEMY_WIDTH;

    expect(maxRight, 'paced toward the spike').toBeGreaterThan(
      BEFORE_SPIKE_COLUMN * TILE_SIZE,
    );
  });

  it('should kill the enemy and clear it once it fades when it ends up on a spike', () => {
    const start = createInitialState(
      createSpikeLevel(SPIKE_TRAP_COLUMN, [SECOND_ENEMY_SPAWN]),
      0,
      [],
    );

    expect(start.enemies).toHaveLength(1);

    const placed = {
      ...start,
      enemies: [
        {
          ...start.enemies[0],
          position: {
            x: 5 * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2,
            y: FLOOR_ENEMY_Y,
          },
        },
      ],
    };
    const ticked = nextTick(placed);

    expect(ticked.enemies, 'lingers while it fades').toHaveLength(1);
    expect(ticked.enemies[0].timers.death).toBe(0);
    expect(ticked.enemies[0].velocity.x.current, 'stops dead').toBe(0);
    expect(
      ticked.enemies[0].position.y,
      'already on solid ground — nowhere to fall',
    ).toBe(FLOOR_ENEMY_Y);

    const faded = nextTicks(ticked, computeTickCount(ENEMY_DEATH_SECONDS));

    expect(faded.enemies).toHaveLength(0);
  });

  it('should keep the enemy falling when it dies in mid-air', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const dying = {
      ...settled,
      enemies: [
        {
          ...enemy,
          position: { ...enemy.position, y: enemy.position.y - 3 * TILE_SIZE },
          velocity: {
            ...enemy.velocity,
            y: { ...enemy.velocity.y, current: 0 },
          },
          statuses: { ...enemy.statuses, isGrounded: false },
          timers: { death: 0, reload: 0 },
        },
      ],
    };
    const startY = dying.enemies[0].position.y;
    const ticked = nextTick(dying);

    expect(
      ticked.enemies[0].position.y,
      'the corpse keeps falling instead of hanging frozen in the air',
    ).toBeGreaterThan(startY);
    expect(
      ticked.enemies[0].velocity.y.current,
      'gravity is still acting on it',
    ).toBeGreaterThan(0);
  });

  it('should let the player through unharmed when the enemy is dying', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const overlapping = {
      ...settled,
      player: {
        ...settled.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: 0 },
        },
      },
      enemies: [{ ...enemy, timers: { ...enemy.timers, death: 0 } }],
    };
    const before = overlapping.deaths;
    const ticked = nextTick(overlapping);

    expect(ticked.deaths, 'a fading enemy has no bite left').toBe(before);
    expect(ticked.player.timers.death).toBeNull();
  });

  it('should cost a heart and leave the player standing but invincible when an enemy touches them', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const touching = {
      ...settled,
      player: {
        ...settled.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: 0 },
        },
      },
    };
    const before = touching.deaths;
    const restingX = enemy.position.x;
    const ticked = nextTick(touching);

    expect(ticked.player.hearts.value, 'the bump drains a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(ticked.player.timers.invincibility).toBeGreaterThan(0);
    expect(ticked.player.timers.death, 'no death, no respawn').toBeNull();
    expect(ticked.player.position.x, 'and no knockback').toBe(restingX);
    expect(ticked.deaths).toBe(before);
  });

  it('should end the run when an enemy takes the last heart', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const touching = {
      ...settled,
      player: {
        ...settled.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: 0 },
        },
        hearts: { value: 1 },
      },
    };
    const before = touching.deaths;
    const ticked = nextTick(touching);

    expect(ticked.player.hearts.value, 'the last heart is spent').toBe(0);
    expect(
      ticked.player.timers.death,
      'with nothing in reserve the bump is lethal',
    ).not.toBeNull();
    expect(ticked.status, 'and the run is over').toBe('GAME_OVER');
    expect(ticked.deaths).toBe(before + 1);
    expect(
      removeUpdateTime(nextTicks(ticked, TWO_SECOND_TICKS)),
      'a finished run does not move on',
    ).toEqual(removeUpdateTime(ticked));
  });

  it('should leave the player unhurt when the pit keeps them apart from the enemy', () => {
    const start = createHoppingEnemyState();
    const placed = {
      ...start,
      player: {
        ...start.player,
        position: { x: 15 * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      },
    };
    const deaths = placed.deaths;
    const ticked = nextTicks(placed, TWO_SECOND_TICKS);

    expect(ticked.deaths).toBe(deaths);
  });

  it('should spare the player when they only graze the enemy and the drawn bodies never touch', () => {
    const start = createHoppingEnemyState();
    const enemyFloorY = SURFACE - ENEMY_HEIGHT;
    const playerLeft = 6 * TILE_SIZE;
    const placed: GameState = {
      ...start,
      player: {
        ...start.player,
        position: { x: playerLeft, y: SURFACE - PLAYER_HEIGHT },
        velocity: {
          x: { ...start.player.velocity.x, current: 0 },
          y: { ...start.player.velocity.y, current: 0 },
        },
        statuses: { ...start.player.statuses, isGrounded: true },
      },
      enemies: [
        {
          kind: 'HOPPING',
          position: { x: playerLeft + 17, y: enemyFloorY },
          velocity: {
            x: { current: 0, max: ENEMY_MOVE_SPEED },
            y: { current: 0, max: ENEMY_JUMP_VELOCITY },
          },
          timers: { death: null, reload: 0 },
          spawn: { x: playerLeft + 17, y: enemyFloorY },
          statuses: { isFacingRight: true, isGrounded: true },
        },
      ],
    };
    const before = placed.deaths;
    const ticked = nextTick(placed);

    expect(ticked.deaths, 'grazing the bounding boxes is not lethal').toBe(
      before,
    );
  });

  it('should kill the enemy and cost no heart when the player lands on it from above at terminal velocity', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const falling = {
      ...settled,
      player: {
        ...settled.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + HEAD_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: DIVE_SPEED },
        },
        statuses: { ...settled.player.statuses, isGrounded: false },
      },
    };
    const before = falling.deaths;
    const ticked = nextTick(falling);

    expect(
      ticked.enemies[0].timers.death,
      'still a clean stomp, even landing well past the head',
    ).toBe(0);
    expect(ticked.player.hearts.value, 'no damage from a clean stomp').toBe(
      BASE_HEARTS,
    );
    expect(ticked.player.velocity.y.current, 'the player bounces back up').toBe(
      -STOMP_BOUNCE_VELOCITY,
    );
    expect(ticked.deaths).toBe(before);
  });

  it('should clear the stomped enemy away when its death fade finishes', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const falling = {
      ...settled,
      player: {
        ...settled.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + HEAD_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: DIVE_SPEED },
        },
        statuses: { ...settled.player.statuses, isGrounded: false },
      },
    };
    const ticked = nextTick(falling);

    expect(ticked.enemies, 'lingers while it fades').toHaveLength(1);

    const faded = nextTicks(ticked, computeTickCount(ENEMY_DEATH_SECONDS));

    expect(faded.enemies, 'gone once fully faded').toHaveLength(0);
  });

  it('should launch a full jump rather than the small bounce when the player stomps an enemy with jump held', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const jumped = nextGameState(settled, { type: 'JUMP_START' }, constant(0));
    const falling = {
      ...jumped,
      player: {
        ...jumped.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + HEAD_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...jumped.player.velocity,
          y: { ...jumped.player.velocity.y, current: 1000 },
        },
        statuses: { ...jumped.player.statuses, isGrounded: false },
      },
    };
    const ticked = nextTick(falling);

    expect(ticked.enemies[0].timers.death, 'still a clean stomp').toBe(0);
    expect(ticked.player.hearts.value, 'no damage from a clean stomp').toBe(
      BASE_HEARTS,
    );
    expect(
      ticked.player.velocity.y.current,
      'a held jump button turns the bounce into a full jump',
    ).toBe(-ticked.player.velocity.y.max);
    expect(
      -ticked.player.velocity.y.current,
      'stronger than the ordinary stomp bounce',
    ).toBeGreaterThan(STOMP_BOUNCE_VELOCITY);
  });

  it('should kill the enemy and spare the heart when it hops up into the falling player', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const meeting = {
      ...settled,
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
        ...settled.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y - TILE_SIZE + HEAD_ON_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: PLAYER_FALL_SPEED },
        },
        statuses: { ...settled.player.statuses, isGrounded: false },
      },
    };
    const before = meeting.deaths;
    const ticked = nextTick(meeting);

    expect(
      ticked.enemies[0].timers.death,
      'meeting it head-on on the way down is still a stomp',
    ).toBe(0);
    expect(ticked.player.hearts.value, 'and costs nothing').toBe(BASE_HEARTS);
    expect(ticked.player.velocity.y.current, 'the player bounces back up').toBe(
      -STOMP_BOUNCE_VELOCITY,
    );
    expect(ticked.deaths).toBe(before);
  });

  it('should kill the enemy when the player only clips its edge on the way down', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const falling = {
      ...settled,
      player: {
        ...settled.player,
        position: {
          x: enemy.position.x - WIDEST_CLIPPING_OFFSET,
          y: enemy.position.y + HEAD_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: PLAYER_FALL_SPEED },
        },
        statuses: { ...settled.player.statuses, isGrounded: false },
      },
    };
    const ticked = nextTick(falling);

    expect(
      ticked.enemies[0].timers.death,
      'clipping the head with the edge of the boot counts',
    ).toBe(0);
    expect(ticked.player.hearts.value, 'no damage from a clipped stomp').toBe(
      BASE_HEARTS,
    );
  });

  it('should cost a heart rather than count as a stomp when the enemy lands on the player from above', () => {
    const start = createHoppingEnemyState();
    const player = {
      ...start.player,
      position: { x: PLAYER_COLUMN * TILE_SIZE, y: SURFACE - PLAYER_HEIGHT },
      velocity: {
        x: { ...start.player.velocity.x, current: 0 },
        y: { ...start.player.velocity.y, current: 0 },
      },
      statuses: { ...start.player.statuses, isGrounded: true },
    };
    const landing = {
      ...start,
      player,
      enemies: [
        {
          ...start.enemies[0],
          position: { x: player.position.x, y: player.position.y - DROP_GAP },
          velocity: {
            x: { current: 0, max: ENEMY_MOVE_SPEED },
            y: { current: ENEMY_FALL_SPEED, max: ENEMY_JUMP_VELOCITY },
          },
          statuses: { ...start.enemies[0].statuses, isGrounded: false },
        },
      ],
    };
    const before = landing.deaths;
    const ticked = nextTick(landing);

    expect(ticked.player.hearts.value, 'a falling enemy still hurts').toBe(
      BASE_HEARTS - 1,
    );
    expect(
      ticked.enemies[0].timers.death,
      'the enemy dealt the blow, not the other way round',
    ).toBeNull();
    expect(ticked.deaths).toBe(before);
  });

  it('should die and cost a heart when the horned enemy is touched from the side', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const touching: GameState = {
      ...settled,
      enemies: [{ ...enemy, kind: 'HORNED' }],
      player: {
        ...settled.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: 0 },
        },
      },
    };
    const before = touching.deaths;
    const ticked = nextTick(touching);

    expect(ticked.player.hearts.value, 'the trade costs a heart').toBe(
      BASE_HEARTS - 1,
    );
    expect(ticked.enemies[0].timers.death, 'and the horn breaks').toBe(0);
    expect(ticked.deaths).toBe(before);
  });

  it('should die and still cost a heart when the horned enemy is stomped from above', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const falling: GameState = {
      ...settled,
      enemies: [{ ...enemy, kind: 'HORNED' }],
      player: {
        ...settled.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + HEAD_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: DIVE_SPEED },
        },
        statuses: { ...settled.player.statuses, isGrounded: false },
      },
    };
    const before = falling.deaths;
    const ticked = nextTick(falling);

    expect(ticked.enemies[0].timers.death, 'the hit kills it too').toBe(0);
    expect(ticked.player.hearts.value, 'landing on it still hurts').toBe(
      BASE_HEARTS - 1,
    );
    expect(
      ticked.player.velocity.y.current,
      'no stomp bounce for a horned enemy',
    ).toBeGreaterThan(0);
    expect(ticked.deaths).toBe(before);
  });

  it('should fire a cannonball towards the player when the shooter finishes its reload', () => {
    const start = createShooterEnemyState(20 * TILE_SIZE);

    const ticked = nextTicks(start, computeTickCount(SHOOTER_RELOAD_SECONDS));

    expect(size(ticked.cannonballs), 'the shooter fired').toBeGreaterThan(0);
    expect(
      ticked.cannonballs[0].velocity.x.current,
      'and aimed right at the player',
    ).toBeGreaterThan(0);
  });

  it('should still be reloading when a cannon would already have fired', () => {
    const start = createShooterEnemyState(20 * TILE_SIZE);

    const ticked = nextTicks(start, computeTickCount(CANNON_RELOAD_SECONDS));

    expect(ticked.cannonballs).toEqual([]);
  });

  it('should hold its fire when the player is out of the shooter range', () => {
    const start = createShooterEnemyState(20 * TILE_SIZE);
    const far: GameState = {
      ...start,
      enemies: map(start.enemies, (enemy): Enemy => ({
        ...enemy,
        position: {
          x: enemy.position.x - SHOOTER_RANGE * 2,
          y: enemy.position.y,
        },
      })),
    };

    const ticked = nextTicks(far, computeTickCount(SHOOTER_RELOAD_SECONDS));

    expect(ticked.cannonballs).toEqual([]);
  });

  it('should walk at half the pace of a hopping enemy when the shooter paces', () => {
    const computePace = (state: GameState): number =>
      Math.abs(nextTicks(state, SETTLE_TICKS).enemies[0].velocity.x.current);

    const shooterPace = computePace(createShooterEnemyState(20 * TILE_SIZE));
    const hoppingPace = computePace(nextTicks(createHoppingEnemyState(), 1));

    expect(shooterPace).toBeCloseTo(hoppingPace / 2);
  });

  it('should die and still cost a heart when the shooter is stomped from above', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const falling: GameState = {
      ...settled,
      enemies: [{ ...enemy, kind: 'SHOOTER' }],
      player: {
        ...settled.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + HEAD_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: DIVE_SPEED },
        },
        statuses: { ...settled.player.statuses, isGrounded: false },
      },
    };
    const ticked = nextTick(falling);

    expect(ticked.enemies[0].timers.death, 'the hit kills it too').toBe(0);
    expect(ticked.player.hearts.value, 'its horns still hurt').toBe(
      BASE_HEARTS - 1,
    );
    expect(
      ticked.player.velocity.y.current,
      'no stomp bounce for a shooter',
    ).toBeGreaterThan(0);
  });

  it('should spare the horned enemy when the player is still invincible', () => {
    const start = createHoppingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const touching: GameState = {
      ...settled,
      enemies: [{ ...enemy, kind: 'HORNED' }],
      player: {
        ...settled.player,
        position: { x: enemy.position.x, y: enemy.position.y },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: 0 },
        },
        timers: {
          ...settled.player.timers,
          invincibility: HURT_INVINCIBLE_SECONDS,
        },
      },
    };
    const ticked = nextTick(touching);

    expect(
      ticked.enemies[0].timers.death,
      'an invincible player cannot gore it',
    ).toBeNull();
    expect(ticked.player.hearts.value, 'and takes no further damage').toBe(
      BASE_HEARTS,
    );
  });

  it('should hop 30% lower than a hopping enemy when the enemy is horned', () => {
    const computeHopVelocity = (kind: EnemyKind, jumpMax: number): number =>
      pipe(
        nextTicks(createHoppingEnemyState(), SETTLE_TICKS),
        (settled) => ({ settled, enemy: settled.enemies[0] }),
        ({ settled, enemy }): GameState => ({
          ...settled,
          enemies: [
            {
              ...enemy,
              kind,
              velocity: { ...enemy.velocity, y: { current: 0, max: jumpMax } },
            },
          ],
          player: {
            ...settled.player,
            position: {
              x: enemy.position.x,
              y: enemy.position.y - 3 * TILE_SIZE,
            },
            velocity: {
              ...settled.player.velocity,
              y: { ...settled.player.velocity.y, current: 0 },
            },
          },
        }),
        (overhead) => nextTick(overhead),
        (ticked) => ticked.enemies[0].velocity.y.current,
      );

    const hoppingVelocityY = computeHopVelocity('HOPPING', ENEMY_JUMP_VELOCITY);
    const hornedVelocityY = computeHopVelocity(
      'HORNED',
      HORNED_ENEMY_JUMP_VELOCITY,
    );

    expect(hoppingVelocityY, 'the hopping enemy launched upward').toBeLessThan(
      0,
    );
    expect(
      hornedVelocityY,
      'the horned enemy launched upward too',
    ).toBeLessThan(0);
    expect(
      hornedVelocityY - hoppingVelocityY,
      'but 30% weaker than the hopping enemy',
    ).toBeCloseTo(ENEMY_JUMP_VELOCITY - HORNED_ENEMY_JUMP_VELOCITY);
  });

  it('should hold its column and bounce one block either side of its spawn when the enemy flies', () => {
    const start = createFlyingEnemyState();

    expect(start.enemies[0].kind, 'nothing solid sits beneath this tile').toBe(
      'FLYING',
    );

    const spawn = start.enemies[0].spawn;
    const enemies = map(
      nextTickStates(start, LONG_PACE_TICKS),
      (state) => state.enemies[0],
    );

    times(size(enemies), (tickIndex) =>
      expect(
        enemies[tickIndex].statuses.isGrounded,
        `never grounded at tick ${tickIndex}`,
      ).toBe(false),
    );
    times(size(enemies), (tickIndex) =>
      expect(
        enemies[tickIndex].position.x,
        `never drifts sideways at tick ${tickIndex}`,
      ).toBe(spawn.x),
    );

    const minY = minBy(enemies, (enemy) => enemy.position.y)?.position.y ?? 0;
    const maxY = maxBy(enemies, (enemy) => enemy.position.y)?.position.y ?? 0;

    expect(minY, 'rises a full block above spawn').toBeCloseTo(
      spawn.y - TILE_SIZE,
    );
    expect(maxY, 'and falls a full block below spawn').toBeCloseTo(
      spawn.y + TILE_SIZE,
    );
  });

  it('should die like a hopping one when the flying enemy is stomped from above', () => {
    const start = createFlyingEnemyState();
    const settled = nextTicks(start, SETTLE_TICKS);
    const enemy = settled.enemies[0];
    const falling = {
      ...settled,
      player: {
        ...settled.player,
        position: {
          x: enemy.position.x,
          y: enemy.position.y + HEAD_OVERLAP - PLAYER_HEIGHT,
        },
        velocity: {
          ...settled.player.velocity,
          y: { ...settled.player.velocity.y, current: DIVE_SPEED },
        },
        statuses: { ...settled.player.statuses, isGrounded: false },
      },
    };
    const ticked = nextTick(falling);

    expect(ticked.enemies[0].timers.death, 'a clean stomp kills it too').toBe(
      0,
    );
    expect(ticked.player.hearts.value, 'no damage from a clean stomp').toBe(
      BASE_HEARTS,
    );
    expect(ticked.player.velocity.y.current, 'the player bounces back up').toBe(
      -STOMP_BOUNCE_VELOCITY,
    );
  });

  it('should leave the game it was handed untouched when the game moves on a tick', () => {
    const start = createHoppingEnemyState();

    nextTick(start);

    expect(start).toEqual(createHoppingEnemyState());
  });
});
