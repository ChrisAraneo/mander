import {
  type Enemy,
  type EnemyKind,
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { find, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../../state/create-initial-state';
import type { GameState } from '../../state/types/game-state';
import type { GameLevel } from '../../types/game-level';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { BASE_HEARTS, PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { reduce } from '../reduce';
import {
  BEARTRAP_JUMP_TILES,
  BEARTRAP_JUMP_VELOCITY,
  BEARTRAP_TRIGGER_RANGE,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  HORNED_ENEMY_CHANCE,
} from './consts';
import { beartrapAhead } from './beartrap-ahead';
import { createEnemies } from './create-enemies';
import { crushEnemies } from './crush-enemies';
import { playerNearTrap } from './player-near-trap';
import { stepBeartrap } from './step-beartrap';

const DELTA_SECONDS = 1 / 60;

const WIDTH = 20;
const HEIGHT = 14;
const FLOOR_ROW = 12;
const TRAP_ROW = FLOOR_ROW - 1;
const TRAP_COLUMN = 6;

const TRAP_X = TRAP_COLUMN * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;
const TRAP_Y = FLOOR_ROW * TILE_SIZE - ENEMY_HEIGHT;
const TRAP_CENTRE_X = TRAP_X + ENEMY_WIDTH / 2;
const TRAP_CENTRE_Y = TRAP_Y + ENEMY_HEIGHT / 2;

const room = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column): Tile => {
      if (row >= FLOOR_ROW) return TILE_DIRT;
      if (row === TRAP_ROW && column === TRAP_COLUMN) return TILE_BEARTRAP;
      return TILE_AIR;
    }),
  ),
  chestItems: [],
});

const arena = (): GameLevel => ({
  ...room(),
  hornedEnemyChance: HORNED_ENEMY_CHANCE,
});

const trapIn = (level: Level): Enemy =>
  createEnemies({ ...level, hornedEnemyChance: HORNED_ENEMY_CHANCE })[0];

const standing = (gap: number): Player => ({
  position: {
    x: TRAP_CENTRE_X + gap - PLAYER_WIDTH / 2,
    y: FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const eyeToEye = (gap: number): Player => {
  const watcher = standing(gap);
  watcher.position.y = TRAP_CENTRE_Y - PLAYER_HEIGHT / 2;
  return watcher;
};

const watchedFor = (
  frames: number,
  watcher: Player,
): { trap: Enemy; peak: number } => {
  const level = room();
  let trap = trapIn(level);
  let peak = trap.position.y;

  times(frames, () => {
    trap = stepBeartrap(level, trap, watcher, DELTA_SECONDS);
    peak = Math.min(peak, trap.position.y);
  });

  return { trap, peak };
};

const leapAndLand = (watcher: Player): Enemy => {
  const level = room();
  let trap = trapIn(level);
  let hasLeapt = false;

  for (let frame = 0; frame < 200; frame++) {
    trap = stepBeartrap(level, trap, watcher, DELTA_SECONDS);
    if (!trap.statuses.isGrounded) hasLeapt = true;
    else if (hasLeapt) return trap;
  }

  return trap;
};

const enemyAt = (kind: EnemyKind, x: number, y: number): Enemy => ({
  kind,
  position: { x, y },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null },
  spawn: { x, y },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('createEnemies', () => {
  it('lays a beartrap on the solid block under every tile that asks for one', () => {
    expect(createEnemies(arena())).toEqual([
      {
        kind: 'BEARTRAP',
        position: { x: TRAP_X, y: TRAP_Y },
        velocity: {
          x: { current: 0, max: 0 },
          y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
        },
        timers: { death: null },
        spawn: { x: TRAP_X, y: TRAP_Y },
        statuses: { isFacingRight: true, isGrounded: false },
      },
    ]);
  });

  it('lays nothing in a room without the tile', () => {
    const bare = arena();
    bare.tiles[TRAP_ROW][TRAP_COLUMN] = TILE_AIR;

    expect(createEnemies(bare)).toEqual([]);
  });
});

describe('playerNearTrap', () => {
  it('notices the player at two blocks, and at anything closer, from either side', () => {
    times(4, (index) => {
      const gap = [-BEARTRAP_TRIGGER_RANGE, -1, 1, BEARTRAP_TRIGGER_RANGE][
        index
      ];

      expect(playerNearTrap(trapIn(room()), eyeToEye(gap)), 'gap ' + gap).toBe(
        true,
      );
    });
  });

  it('misses the player a pixel beyond two blocks, on either side', () => {
    times(2, (side) => {
      const gap = (side === 0 ? -1 : 1) * (BEARTRAP_TRIGGER_RANGE + 1);

      expect(playerNearTrap(trapIn(room()), eyeToEye(gap)), 'gap ' + gap).toBe(
        false,
      );
    });
  });

  it('notices the player sailing overhead within two blocks', () => {
    const leaping = eyeToEye(TILE_SIZE);
    leaping.position.y -= TILE_SIZE * 3;

    expect(playerNearTrap(trapIn(room()), leaping)).toBe(true);
  });

  it('ignores a player who is already dead', () => {
    const fallen = eyeToEye(0);
    fallen.timers.death = 0;

    expect(playerNearTrap(trapIn(room()), fallen)).toBe(false);
  });
});

describe('beartrapAhead', () => {
  const UP_TO_TRAP_FROM_LEFT = TRAP_COLUMN * TILE_SIZE - ENEMY_WIDTH;
  const UP_TO_TRAP_FROM_RIGHT = (TRAP_COLUMN + 1) * TILE_SIZE;

  it('sees the trap the enemy walking right is about to step into', () => {
    expect(beartrapAhead(room(), UP_TO_TRAP_FROM_LEFT, TRAP_Y, 1)).toBe(true);
  });

  it('sees the trap the enemy walking left is about to step into', () => {
    expect(beartrapAhead(room(), UP_TO_TRAP_FROM_RIGHT, TRAP_Y, -1)).toBe(true);
  });

  it('sees nothing behind the enemy walking away from the trap', () => {
    expect(beartrapAhead(room(), UP_TO_TRAP_FROM_LEFT, TRAP_Y, -1)).toBe(false);
  });

  it('sees nothing on open floor across the room', () => {
    expect(beartrapAhead(room(), 0, TRAP_Y, 1)).toBe(false);
  });

  it('sees nothing in a room without the tile', () => {
    const bare = room();
    bare.tiles[TRAP_ROW][TRAP_COLUMN] = TILE_AIR;

    expect(beartrapAhead(bare, UP_TO_TRAP_FROM_LEFT, TRAP_Y, 1)).toBe(false);
  });
});

describe('stepBeartrap', () => {
  it('lies still on its block while the player keeps further than two blocks off', () => {
    const { trap } = watchedFor(120, standing(BEARTRAP_TRIGGER_RANGE * 4));

    expect(trap.position).toEqual({ x: TRAP_X, y: TRAP_Y });
    expect(trap.statuses.isGrounded).toBe(true);
    expect(trap.velocity.y.current).toBe(0);
  });

  it('springs as soon as the player steps within two blocks', () => {
    const { trap } = watchedFor(2, standing(0));

    expect(trap.position.y).toBeLessThan(TRAP_Y);
    expect(trap.statuses.isGrounded).toBe(false);
  });

  it('jumps six blocks high', () => {
    const { peak } = watchedFor(120, standing(0));

    expect(TRAP_Y - peak).toBeGreaterThan(
      (BEARTRAP_JUMP_TILES - 0.5) * TILE_SIZE,
    );
    expect(TRAP_Y - peak).toBeLessThanOrEqual(BEARTRAP_JUMP_TILES * TILE_SIZE);
  });

  it('comes down in the very place it left', () => {
    const trap = leapAndLand(standing(0));

    expect(trap.position).toEqual({ x: TRAP_X, y: TRAP_Y });
    expect(trap.statuses.isGrounded).toBe(true);
  });

  it('never drifts sideways, however long it is left leaping', () => {
    const { trap } = watchedFor(600, standing(0));

    expect(trap.position.x).toBe(TRAP_X);
  });

  it('goes off again once it has settled back down', () => {
    const level = room();
    let trap = trapIn(level);
    let launches = 0;

    times(600, () => {
      const next = stepBeartrap(level, trap, standing(0), DELTA_SECONDS);
      if (trap.statuses.isGrounded && !next.statuses.isGrounded) launches += 1;
      trap = next;
    });

    expect(launches).toBeGreaterThan(1);
  });

  it('stays put once the player has walked back out of reach', () => {
    const { trap } = watchedFor(120, standing(BEARTRAP_TRIGGER_RANGE + 40));

    expect(trap.position).toEqual({ x: TRAP_X, y: TRAP_Y });
  });
});

describe('crushEnemies', () => {
  const trap = enemyAt('BEARTRAP', TRAP_X, TRAP_Y);

  it('kills the enemy it closes on', () => {
    const prey = enemyAt('HOPPING', TRAP_X, TRAP_Y);
    const [snapped, caught] = crushEnemies([trap, prey]);

    expect(caught.timers.death).toBe(0);
    expect(snapped.timers.death).toBeNull();
  });

  it('kills a horned enemy just the same', () => {
    const [, caught] = crushEnemies([
      trap,
      enemyAt('HORNED', TRAP_X + 4, TRAP_Y - 4),
    ]);

    expect(caught.timers.death).toBe(0);
  });

  it('leaves an enemy it is nowhere near alone', () => {
    const prey = enemyAt('HOPPING', TRAP_X + TILE_SIZE * 3, TRAP_Y);

    expect(crushEnemies([trap, prey])).toEqual([trap, prey]);
  });

  it('leaves another beartrap it is sitting on alone', () => {
    const other = enemyAt('BEARTRAP', TRAP_X, TRAP_Y);

    expect(crushEnemies([trap, other])).toEqual([trap, other]);
  });

  it('leaves the enemies alone while it is dying itself', () => {
    const dying = { ...trap, timers: { death: 0.1 } };
    const prey = enemyAt('HOPPING', TRAP_X, TRAP_Y);

    expect(crushEnemies([dying, prey])).toEqual([dying, prey]);
  });

  it('leaves an already dying enemy where it lies', () => {
    const dying = {
      ...enemyAt('HOPPING', TRAP_X, TRAP_Y),
      timers: { death: 0.2 },
    };

    expect(crushEnemies([trap, dying])).toEqual([trap, dying]);
  });

  it('hands back a room of enemies untouched when no trap is laid', () => {
    const crowd = [
      enemyAt('HOPPING', TRAP_X, TRAP_Y),
      enemyAt('HORNED', TRAP_X, TRAP_Y),
    ];

    expect(crushEnemies(crowd)).toEqual(crowd);
  });
});

describe('a level being played', () => {
  const withSpawn = (column: number, row: number): GameLevel => {
    const level = arena();
    level.tiles[row][column] = TILE_SPAWN;
    return level;
  };

  const played = (level: GameLevel, frames: number): GameState => {
    let state = createInitialState(level, 0, []);
    times(frames, () => {
      state = reduce(state, { type: 'TICK', deltaSeconds: DELTA_SECONDS });
    });
    return state;
  };

  it('costs the player a heart when it snaps shut on them', () => {
    const bitten = played(withSpawn(TRAP_COLUMN, FLOOR_ROW - 5), 90);

    expect(bitten.player.hearts.value).toBe(BASE_HEARTS - 1);
  });

  it('survives the player dropping onto it', () => {
    const jumped = played(withSpawn(TRAP_COLUMN, FLOOR_ROW - 5), 90);

    expect(size(jumped.enemies)).toBe(1);
    expect(jumped.enemies[0].kind).toBe('BEARTRAP');
    expect(jumped.enemies[0].timers.death).toBeNull();
  });

  it('turns the walking enemy back before it steps into the trap', () => {
    const level = withSpawn(WIDTH - 2, FLOOR_ROW - 1);
    level.tiles[TRAP_ROW][TRAP_COLUMN - 3] = TILE_ENEMY;

    const patrolled = played(level, 300);
    const walker = find(
      patrolled.enemies,
      (enemy) => enemy.kind !== 'BEARTRAP',
    );

    expect(walker, 'the enemy is still on its feet').toBeDefined();
    expect(walker?.timers.death).toBeNull();
    expect(walker!.position.x + ENEMY_WIDTH).toBeLessThanOrEqual(TRAP_X);
  });

  it('kills the flying enemy its leap carries it into', () => {
    const level = withSpawn(TRAP_COLUMN + 1, FLOOR_ROW - 1);
    level.tiles[TRAP_ROW - 3][TRAP_COLUMN] = TILE_ENEMY;

    const cleared = played(level, 120);

    expect(size(cleared.enemies)).toBe(1);
    expect(cleared.enemies[0].kind).toBe('BEARTRAP');
  });

  it('leaves the player alone across the room', () => {
    const safe = played(withSpawn(TRAP_COLUMN + 8, FLOOR_ROW - 1), 90);

    expect(safe.player.hearts.value).toBe(BASE_HEARTS);
  });

  it('springs at the player who tries to jump clean over it', () => {
    const level = withSpawn(1, FLOOR_ROW - 1);
    let state = reduce(createInitialState(level, 0, []), {
      type: 'MOVE_RIGHT_START',
    });
    let hasSettled = false;
    let sprang = false;
    let leftTheGround = false;

    for (let frame = 0; frame < 240; frame++) {
      const gap = TRAP_CENTRE_X - (state.player.position.x + PLAYER_WIDTH / 2);

      if (gap <= TILE_SIZE * 3 && state.player.statuses.isGrounded)
        state = reduce(state, { type: 'JUMP_START' });

      state = reduce(state, { type: 'TICK', deltaSeconds: DELTA_SECONDS });

      const trap = state.enemies[0];
      if (trap.statuses.isGrounded) hasSettled = true;
      else if (hasSettled) sprang = true;

      leftTheGround = leftTheGround || !state.player.statuses.isGrounded;
    }

    expect(leftTheGround, 'the player really jumped').toBe(true);
    expect(sprang, 'the trap went off').toBe(true);
    expect(state.player.hearts.value, 'and caught them').toBe(BASE_HEARTS - 1);
  });

  it('is laid again when the player respawns, as the enemies are', () => {
    const level = withSpawn(TRAP_COLUMN + 1, FLOOR_ROW - 1);
    const respawned = reduce(played(level, 90), { type: 'RESPAWN' });

    expect(respawned.enemies).toEqual(createEnemies(level));
  });
});
