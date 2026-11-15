import {
  type Cannon,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_HEARTS, PLAYER_WIDTH } from '../player/consts';
import { createPlayer } from '../player/create-player';
import type { GameLevel } from '../state/types/game-level';
import {
  CANNON_RANGE,
  CANNON_RELOAD_SECONDS,
  CANNONBALL_SPEED,
  TRIPLE_CANNON_SHOT_GAP_SECONDS,
} from './consts';
import { nextCannons } from './next-cannons';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const CANNON_LEFT = 10 * TILE_SIZE;
const CANNON_TOP = 2 * TILE_SIZE;
const PLAYER_TOP = 56;
const ONE_PIXEL = 1;

const DELTA_SECONDS = 0.02;

const LONG_TICK_SECONDS = 0.5;

const LOADED_RELOAD_SECONDS = 0.02;

const LOADING_RELOAD_SECONDS = 10;

const ALMOST_LOADED_SECONDS = 0.01;

const RIGHT_OF_CANNON_X = 400;

const LEFT_OF_CANNON_X = 200;

const ON_THE_CANNON_X = 325;

const OUT_OF_RANGE_X = 1100;

const RANGE_EDGE_LEFT =
  CANNON_LEFT + TILE_SIZE / 2 + CANNON_RANGE - PLAYER_WIDTH / 2;

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const createCannon = (reload: number, isFacingRight: boolean): Cannon => ({
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: CANNON_LEFT, y: CANNON_TOP },
  timers: { reload },
  statuses: { isFacingRight },
});

const computeFacings = (cannons: Cannon[]): boolean[] =>
  map(cannons, (cannon) => cannon.statuses.isFacingRight);

describe('nextCannons', () => {
  it('should turn the cannon to the right when the player stands to its right', () => {
    const cannons = [createCannon(LOADING_RELOAD_SECONDS, false)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(computeFacings(barrage.cannons)).toEqual([true]);
  });

  it('should turn the cannon to the left when the player stands to its left', () => {
    const cannons = [createCannon(LOADING_RELOAD_SECONDS, true)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(LEFT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(computeFacings(barrage.cannons)).toEqual([false]);
  });

  it('should turn the cannon to the right when the centre of the player is level with the centre of the cannon', () => {
    const cannons = [createCannon(LOADING_RELOAD_SECONDS, false)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(ON_THE_CANNON_X),
      DELTA_SECONDS,
    );

    expect(computeFacings(barrage.cannons)).toEqual([true]);
  });

  it('should fire one cannonball and reload when the player is in range and the cannon has just loaded', () => {
    const cannons = [createCannon(LOADED_RELOAD_SECONDS, false)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage).toEqual({
      cannons: [
        {
          kind: 'REGULAR',
          barrelAngle: 0,
          roundIndex: 0,
          position: { x: CANNON_LEFT, y: CANNON_TOP },
          timers: { reload: CANNON_RELOAD_SECONDS },
          statuses: { isFacingRight: true },
        },
      ],
      cannonballs: [
        {
          position: { x: 330, y: 74 },
          velocity: {
            x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
            y: { current: 0, max: CANNONBALL_SPEED },
          },
        },
      ],
    });
  });

  it('should fire one cannonball and wait a short gap when a triple cannon has just loaded', () => {
    const cannons: Cannon[] = [
      { ...createCannon(LOADED_RELOAD_SECONDS, false), kind: 'TRIPLE' },
    ];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(size(barrage.cannonballs)).toBe(1);
    expect(barrage.cannons[0].timers.reload).toBeCloseTo(
      TRIPLE_CANNON_SHOT_GAP_SECONDS,
      6,
    );
  });

  it('should carry the time it overshot into the next reload when the cannon fires', () => {
    const cannons = [createCannon(ALMOST_LOADED_SECONDS, true)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage.cannons[0].timers.reload).toBeCloseTo(
      ALMOST_LOADED_SECONDS - DELTA_SECONDS + CANNON_RELOAD_SECONDS,
      6,
    );
    expect(barrage.cannons[0].timers.reload).toBeCloseTo(3.49, 6);
    expect(size(barrage.cannonballs)).toBe(1);
  });

  it('should fire the cannonball to the left when the player is in range to the left', () => {
    const cannons = [createCannon(0, true)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(LEFT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage.cannonballs[0].velocity.x.current).toBe(-CANNONBALL_SPEED);
  });

  it('should fire when the player stands exactly at the far end of the range', () => {
    const cannons = [createCannon(0, true)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RANGE_EDGE_LEFT),
      DELTA_SECONDS,
    );

    expect(size(barrage.cannonballs)).toBe(1);
  });

  it('should fire nothing and count down the reload when the player is in range but the cannon is still loading', () => {
    const cannons = [createCannon(LOADING_RELOAD_SECONDS, true)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage.cannonballs).toEqual([]);
    expect(barrage.cannons[0].timers.reload).toBeCloseTo(9.98, 6);
  });

  it('should fire nothing and keep the reload when the player is out of range', () => {
    const cannons = [createCannon(0, false)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(OUT_OF_RANGE_X),
      LONG_TICK_SECONDS,
    );

    expect(barrage).toEqual({
      cannons: [
        {
          kind: 'REGULAR',
          barrelAngle: 0,
          roundIndex: 0,
          position: { x: CANNON_LEFT, y: CANNON_TOP },
          timers: { reload: 0 },
          statuses: { isFacingRight: true },
        },
      ],
      cannonballs: [],
    });
  });

  it('should fire nothing when the player stands just past the far end of the range', () => {
    const cannons = [createCannon(0, true)];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RANGE_EDGE_LEFT + ONE_PIXEL),
      DELTA_SECONDS,
    );

    expect(barrage.cannonballs).toEqual([]);
    expect(barrage.cannons[0].timers.reload).toBe(0);
  });

  it('should fire only from the cannons that are loaded when several cannons see the player', () => {
    const cannons = [
      createCannon(LOADING_RELOAD_SECONDS, true),
      createCannon(0, true),
    ];

    const barrage = nextCannons(
      cannons,
      createPlayerAt(RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(size(barrage.cannons)).toBe(2);
    expect(size(barrage.cannonballs)).toBe(1);
    expect(barrage.cannons[0].timers.reload).toBeCloseTo(9.98, 6);
    expect(barrage.cannons[1].timers.reload).toBeCloseTo(3.48, 6);
  });

  it('should give no cannons and no cannonballs when the level has no cannons', () => {
    const barrage = nextCannons(
      [],
      createPlayerAt(RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage).toEqual({ cannons: [], cannonballs: [] });
  });

  it('should leave the given cannons and the player alone when it moves them on', () => {
    const cannons = [
      createCannon(0, false),
      createCannon(LOADING_RELOAD_SECONDS, true),
    ];
    const player = createPlayerAt(RIGHT_OF_CANNON_X);

    nextCannons(cannons, player, DELTA_SECONDS);

    expect(cannons).toEqual([
      createCannon(0, false),
      createCannon(LOADING_RELOAD_SECONDS, true),
    ]);
    expect(player).toEqual(createPlayerAt(RIGHT_OF_CANNON_X));
  });
});
