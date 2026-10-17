import {
  type Enemy,
  type Fireball,
  type Item,
  MAX_TICK_SECONDS,
  MOON_MAGNET,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
  TILE_SPAWN,
} from '@mander/model';
import { chain } from '@mander/utils';
import { isNull, map, size, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { createInitialState } from '../state/create-initial-state';
import type { GameLevel } from '../types/game-level';
import type { GameState } from '../types/game-state';
import { ENEMY_HEIGHT, ENEMY_WIDTH } from './enemy/consts';
import { advancePlayerFireballs } from './fireball/advance-player-fireballs';
import { burnEnemies } from './fireball/burn-enemies';
import {
  PLAYER_FIREBALL_ANGULAR_SPEED,
  PLAYER_FIREBALL_ORBIT_RADIUS,
} from './fireball/consts';
import { countStartingFireballs } from './fireball/count-starting-fireballs';
import { createPlayerFireballs } from './fireball/create-player-fireballs';
import { getPlayerFireballPosition } from './fireball/get-player-fireball-position';
import { stepFireball } from './fireball/step-fireball';
import { createBasePlayerVelocity } from './player/create-base-player-velocity';
import { getPlayerCentre } from './player/get-player-centre';
import { handleTick } from './tick/handle-tick';

const DELTA_SECONDS = 1 / 60;

const createTrinket = (id: string): Item => ({
  id,
  name: id,
  description: id,
  rarity: 'COMMON',
  effect: { kind: 'NONE' },
});

const createPlayer = (left = 0, top = 0): Player => ({
  position: { x: left, y: top },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: {
    isFacingRight: true,
    isGrounded: false,
    isJumpQueued: false,
  },
});

const createEnemy = (
  left: number,
  top: number,
  death: number | null = null,
): Enemy => ({
  kind: 'HOPPING',
  position: { x: left, y: top },
  velocity: createBasePlayerVelocity(),
  timers: { death },
  spawn: { x: left, y: top },
  statuses: { isFacingRight: true, isGrounded: true },
});

const computeOrbitRadius = (fireball: Fireball): number =>
  chain(getPlayerFireballPosition(fireball))
    .thru((orbiting) =>
      Math.hypot(
        orbiting.x - fireball.origin.x,
        orbiting.y - fireball.origin.y,
      ),
    )
    .value();

const createEnemyUnder = (
  fireball: Fireball,
  death: number | null = null,
): Enemy =>
  chain(getPlayerFireballPosition(fireball))
    .thru((orbiting) =>
      createEnemy(
        orbiting.x - ENEMY_WIDTH / 2,
        orbiting.y - ENEMY_HEIGHT / 2,
        death,
      ),
    )
    .value();

const isDying = (victim: Enemy): boolean => !isNull(victim.timers.death);

const WIDTH = 14;

const SPAWN_COLUMN = 2;

const createAirRow = (): Tile[] => times(WIDTH, () => TILE_AIR);

const createGroundLevel = (): GameLevel => ({
  seed: 'ORBIT-LEVEL',
  width: WIDTH,
  height: 4,
  tiles: [
    createAirRow(),
    createAirRow(),
    times(WIDTH, (column) =>
      match(column === SPAWN_COLUMN)
        .with(true, (): Tile => TILE_SPAWN)
        .otherwise((): Tile => TILE_AIR),
    ),
    times(WIDTH, () => TILE_DIRT),
  ],
  chestItems: [],
  hornedEnemyChance: 0,
});

const createStateCarrying = (...items: Item[]): GameState =>
  createInitialState(createGroundLevel(), 0, items);

const patchEnemyUnder = (state: GameState, fireball: Fireball): GameState => ({
  ...state,
  enemies: [createEnemyUnder(fireball)],
});

const patchPlayerDeath = (state: GameState): GameState => ({
  ...state,
  player: { ...state.player, timers: { ...state.player.timers, death: 0 } },
});

const STANDING = createPlayer(3 * TILE_SIZE, 5 * TILE_SIZE);

describe('the fireballs that circle the player', () => {
  it('should give the player none when the magnet is not in the pack', () => {
    expect(createPlayerFireballs([], STANDING)).toEqual([]);
    expect(createPlayerFireballs([createTrinket('GEM')], STANDING)).toEqual([]);
  });

  it('should light the two the magnet promises when the player carries one', () => {
    expect(countStartingFireballs([MOON_MAGNET])).toBe(2);
    expect(createPlayerFireballs([MOON_MAGNET], STANDING)).toHaveLength(2);
  });

  it('should count what each of them is worth when the player carries several magnets', () => {
    expect(
      countStartingFireballs([MOON_MAGNET, createTrinket('GEM'), MOON_MAGNET]),
    ).toBe(4);
  });

  it('should hang them on opposite sides of the player when it lights two', () => {
    const [first, second] = createPlayerFireballs([MOON_MAGNET], STANDING);

    expect(Math.abs(second.angle - first.angle)).toBeCloseTo(Math.PI);
  });

  it('should hang them off the player rather than off a block when it lights them', () => {
    const fireballs = createPlayerFireballs([MOON_MAGNET], STANDING);

    times(size(fireballs), (fireballIndex) =>
      expect(fireballs[fireballIndex].origin).toEqual(
        getPlayerCentre(STANDING),
      ),
    );
  });

  it('should hold each one a fixed distance out when it lights them', () => {
    const fireballs = createPlayerFireballs([MOON_MAGNET], STANDING);

    times(size(fireballs), (fireballIndex) =>
      expect(computeOrbitRadius(fireballs[fireballIndex])).toBeCloseTo(
        PLAYER_FIREBALL_ORBIT_RADIUS,
      ),
    );
  });

  it('should circle them closer in than the fireballs bolted to the level when it lights them', () => {
    expect(PLAYER_FIREBALL_ORBIT_RADIUS).toBeLessThan(5 * TILE_SIZE);
  });

  it('should turn them when time passes', () => {
    const [before] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const [after] = advancePlayerFireballs([before], STANDING, DELTA_SECONDS);

    expect(after.angle).toBeGreaterThan(before.angle);
  });

  it('should carry them along when the player walks', () => {
    const walked = createPlayer(
      STANDING.position.x + TILE_SIZE,
      STANDING.position.y - TILE_SIZE,
    );
    const [followed] = advancePlayerFireballs(
      createPlayerFireballs([MOON_MAGNET], STANDING),
      walked,
      DELTA_SECONDS,
    );

    expect(followed.origin).toEqual(getPlayerCentre(walked));
  });

  it('should burn the enemy when one of them sweeps through it', () => {
    const [fireball] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const [swept] = burnEnemies([fireball], [createEnemyUnder(fireball)]);

    expect(isDying(swept)).toBe(true);
  });

  it('should leave the enemy alone when it stands well clear of the orbit', () => {
    const fireballs = createPlayerFireballs([MOON_MAGNET], STANDING);
    const far = createEnemy(
      STANDING.position.x + 10 * TILE_SIZE,
      STANDING.position.y,
    );

    expect(burnEnemies(fireballs, [far])).toEqual([far]);
  });

  it('should burn nothing when the player carries no magnet', () => {
    const [fireball] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const victim = createEnemyUnder(fireball);

    expect(burnEnemies([], [victim])).toEqual([victim]);
  });

  it('should leave the enemy to its own death when it is already dying', () => {
    const [fireball] = createPlayerFireballs([MOON_MAGNET], STANDING);
    const fading = createEnemyUnder(fireball, 0.2);

    expect(burnEnemies([fireball], [fading])).toEqual([fading]);
  });

  it('should set them circling the player when the very first tick comes', () => {
    expect(
      handleTick(createStateCarrying(MOON_MAGNET), DELTA_SECONDS)
        .playerFireballs,
    ).toHaveLength(2);
    expect(
      handleTick(createStateCarrying(), DELTA_SECONDS).playerFireballs,
    ).toEqual([]);
  });

  it('should keep them circling and following when the game ticks along', () => {
    const state = createStateCarrying(MOON_MAGNET);
    const ticked = handleTick(state, DELTA_SECONDS);

    expect(
      map(ticked.playerFireballs, (fireball) => fireball.angle),
    ).not.toEqual(map(state.playerFireballs, (fireball) => fireball.angle));
    expect(ticked.playerFireballs[0].origin).toEqual(
      getPlayerCentre(ticked.player),
    );
  });

  it('should burn the enemy when it is caught on the orbit as the game ticks along', () => {
    const state = createStateCarrying(MOON_MAGNET);
    const caught = patchEnemyUnder(state, state.playerFireballs[0]);

    expect(isDying(handleTick(caught, DELTA_SECONDS).enemies[0])).toBe(true);
  });

  it('should burn the enemy when the moons only sweep past it mid-tick', () => {
    const state = createStateCarrying(MOON_MAGNET);
    const midTick = stepFireball(
      state.playerFireballs[0],
      MAX_TICK_SECONDS / 4,
      PLAYER_FIREBALL_ANGULAR_SPEED,
    );
    const caught = { ...state, enemies: [createEnemyUnder(midTick)] };

    expect(isDying(handleTick(caught, MAX_TICK_SECONDS).enemies[0])).toBe(true);
  });

  it('should burn nothing when the player lies dying', () => {
    const state = createStateCarrying(MOON_MAGNET);
    const caught = patchPlayerDeath(
      patchEnemyUnder(state, state.playerFireballs[0]),
    );

    expect(isDying(handleTick(caught, DELTA_SECONDS).enemies[0])).toBe(false);
  });

  it('should leave the fireballs bolted to the level where they are when it ticks', () => {
    const state = createStateCarrying(MOON_MAGNET);

    expect(handleTick(state, DELTA_SECONDS).fireballs).toEqual(state.fireballs);
  });
});
