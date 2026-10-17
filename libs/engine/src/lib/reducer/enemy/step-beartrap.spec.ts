import {
  type Enemy,
  type Level,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { chain } from '@mander/utils';
import { filter, reduce, size, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import {
  BEARTRAP_JUMP_TILES,
  BEARTRAP_TRIGGER_RANGE,
  ENEMY_HEIGHT,
  ENEMY_WIDTH,
  HORNED_ENEMY_CHANCE,
} from './consts';
import { createEnemies } from './create-enemies';
import { stepBeartrap } from './step-beartrap';

interface TrapWatch {
  trap: Enemy;
  peak: number;
}

interface TrapLeap {
  trap: Enemy;
  hasLeapt: boolean;
}

const DELTA_SECONDS = 1 / 60;

const WIDTH = 20;

const HEIGHT = 14;

const FLOOR_ROW = 12;

const TRAP_ROW = FLOOR_ROW - 1;

const TRAP_COLUMN = 6;

const TRAP_X = TRAP_COLUMN * TILE_SIZE + (TILE_SIZE - ENEMY_WIDTH) / 2;

const TRAP_Y = FLOOR_ROW * TILE_SIZE - ENEMY_HEIGHT;

const TRAP_CENTRE_X = TRAP_X + ENEMY_WIDTH / 2;

const createRoom = (): Level => ({
  seed: 'SEED',
  width: WIDTH,
  height: HEIGHT,
  tiles: times(HEIGHT, (row): Tile[] =>
    times(WIDTH, (column) =>
      match({
        isFloor: row >= FLOOR_ROW,
        isTrap: row === TRAP_ROW && column === TRAP_COLUMN,
      })
        .with({ isFloor: true }, (): Tile => TILE_DIRT)
        .with({ isTrap: true }, (): Tile => TILE_BEARTRAP)
        .otherwise((): Tile => TILE_AIR),
    ),
  ),
  chestItems: [],
});

const createTrap = (level: Level): Enemy =>
  createEnemies({ ...level, hornedEnemyChance: HORNED_ENEMY_CHANCE })[0];

const createStandingPlayer = (gap: number): Player => ({
  position: {
    x: TRAP_CENTRE_X + gap - PLAYER_WIDTH / 2,
    y: FLOOR_ROW * TILE_SIZE - PLAYER_HEIGHT,
  },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight: true, isGrounded: true, isJumpQueued: false },
});

const nextWatchedFrame = (
  level: Level,
  watch: TrapWatch,
  watcher: Player,
): TrapWatch =>
  chain(stepBeartrap(level, watch.trap, watcher, DELTA_SECONDS))
    .thru((trap): TrapWatch => ({
      trap,
      peak: Math.min(watch.peak, trap.position.y),
    }))
    .value();

const computeWatch = (frameCount: number, watcher: Player): TrapWatch =>
  chain(createRoom())
    .thru((level) => ({ level, trap: createTrap(level) }))
    .thru(({ level, trap }) =>
      reduce(
        times(frameCount),
        (watch) => nextWatchedFrame(level, watch, watcher),
        { trap, peak: trap.position.y },
      ),
    )
    .value();

const nextFramesUntilLanded = (
  level: Level,
  leap: TrapLeap,
  watcher: Player,
  frameLimit: number,
): Enemy =>
  match(frameLimit > 0)
    .with(true, () =>
      chain(stepBeartrap(level, leap.trap, watcher, DELTA_SECONDS))
        .thru((trap) =>
          match({
            isGrounded: trap.statuses.isGrounded,
            hasLeapt: leap.hasLeapt,
          })
            .with({ isGrounded: true, hasLeapt: true }, () => trap)
            .otherwise(() =>
              nextFramesUntilLanded(
                level,
                {
                  trap,
                  hasLeapt: leap.hasLeapt || !trap.statuses.isGrounded,
                },
                watcher,
                frameLimit - 1,
              ),
            ),
        )
        .value(),
    )
    .otherwise(() => leap.trap);

const computeLanding = (watcher: Player): Enemy =>
  chain(createRoom())
    .thru((level) =>
      nextFramesUntilLanded(
        level,
        { trap: createTrap(level), hasLeapt: false },
        watcher,
        200,
      ),
    )
    .value();

const nextTrapFrames = (
  level: Level,
  trap: Enemy,
  watcher: Player,
  frameCount: number,
): Enemy[] =>
  match(frameCount > 0)
    .with(true, () =>
      chain(stepBeartrap(level, trap, watcher, DELTA_SECONDS))
        .thru((stepped) => [
          stepped,
          ...nextTrapFrames(level, stepped, watcher, frameCount - 1),
        ])
        .value(),
    )
    .otherwise((): Enemy[] => []);

describe('stepBeartrap', () => {
  it('should lie still on its block when the player keeps further than two blocks off', () => {
    const { trap } = computeWatch(
      120,
      createStandingPlayer(BEARTRAP_TRIGGER_RANGE * 4),
    );

    expect(trap.position).toEqual({ x: TRAP_X, y: TRAP_Y });
    expect(trap.statuses.isGrounded).toBe(true);
    expect(trap.velocity.y.current).toBe(0);
  });

  it('should spring when the player steps within two blocks', () => {
    const { trap } = computeWatch(2, createStandingPlayer(0));

    expect(trap.position.y).toBeLessThan(TRAP_Y);
    expect(trap.statuses.isGrounded).toBe(false);
  });

  it('should jump six blocks high when it springs', () => {
    const { peak } = computeWatch(120, createStandingPlayer(0));

    expect(TRAP_Y - peak).toBeGreaterThan(
      (BEARTRAP_JUMP_TILES - 0.5) * TILE_SIZE,
    );
    expect(TRAP_Y - peak).toBeLessThanOrEqual(BEARTRAP_JUMP_TILES * TILE_SIZE);
  });

  it('should come down in the very place it left when it has sprung', () => {
    const trap = computeLanding(createStandingPlayer(0));

    expect(trap.position).toEqual({ x: TRAP_X, y: TRAP_Y });
    expect(trap.statuses.isGrounded).toBe(true);
  });

  it('should never drift sideways when it is left leaping a long while', () => {
    const { trap } = computeWatch(600, createStandingPlayer(0));

    expect(trap.position.x).toBe(TRAP_X);
  });

  it('should go off again when it has settled back down', () => {
    const level = createRoom();
    const start = createTrap(level);
    const traps = nextTrapFrames(level, start, createStandingPlayer(0), 600);
    const previousTraps = [start, ...traps];
    const launches = size(
      filter(
        traps,
        (trap, frameIndex) =>
          previousTraps[frameIndex].statuses.isGrounded &&
          !trap.statuses.isGrounded,
      ),
    );

    expect(launches).toBeGreaterThan(1);
  });

  it('should stay put when the player has walked back out of reach', () => {
    const { trap } = computeWatch(
      120,
      createStandingPlayer(BEARTRAP_TRIGGER_RANGE + 40),
    );

    expect(trap.position).toEqual({ x: TRAP_X, y: TRAP_Y });
  });
});
