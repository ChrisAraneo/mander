import {
  type Cannon,
  type Cannonball,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SPAWN,
} from '@mander/model';
import { head, map, repeat, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CANNON_RELOAD_SECONDS, CANNONBALL_SPEED } from '../../cannon/consts';
import { nextCannonballs } from '../../cannon/next-cannonballs';
import { nextCannons } from '../../cannon/next-cannons';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import { createInitialState } from '../../start/create-initial-state';
import type { GameLevel } from '../../state/types/game-level';
import type { GameState } from '../../state/types/game-state';
import { patchMovedBarrage } from './patch-moved-barrage';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SPAWN,
};

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

const LEVEL = createLevel([
  repeat('.', 40),
  repeat('.', 40),
  `s${repeat('.', 39)}`,
  repeat('#', 40),
]);

const DELTA_SECONDS = 0.02;

const LOADED_RELOAD_SECONDS = 0.02;

const LOADING_RELOAD_SECONDS = 10;

const CANNON_X = 320;

const CANNON_Y = 64;

const CANNONBALL_Y = 10;

const PLAYER_Y = 56;

const PLAYER_RIGHT_OF_CANNON_X = 400;

const CANNONBALL_INSIDE_X = 100;

const CANNONBALL_LEAVING_X = 1280;

const MOVED_CANNONBALL_X = 104.4;

const FIRED_CANNONBALL_X = 330;

const FIRED_CANNONBALL_Y = 74;

const EXPECTED_CANNONBALLS = 2;

const PRECISION = 6;

const createCannon = (reload: number): Cannon => ({
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: CANNON_X, y: CANNON_Y },
  timers: { reload },
  statuses: { isFacingRight: false },
});

const createCannonball = (left: number): Cannonball => ({
  position: { x: left, y: CANNONBALL_Y },
  velocity: {
    x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    y: { current: 0, max: CANNONBALL_SPEED },
  },
});

const createState = (
  cannons: Cannon[],
  cannonballs: Cannonball[],
): GameState => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []),
  cannons,
  cannonballs,
});

const createPlayerAt = (left: number): Player => ({
  ...createInitialState(LEVEL, FIRST_LEVEL_INDEX, []).player,
  position: { x: left, y: PLAYER_Y },
});

describe('patchMovedBarrage', () => {
  it('should give the cannons as the cannons move them when the player is near', () => {
    const state = createState(
      [
        createCannon(LOADED_RELOAD_SECONDS),
        createCannon(LOADING_RELOAD_SECONDS),
      ],
      [],
    );
    const player = createPlayerAt(PLAYER_RIGHT_OF_CANNON_X);

    const barrage = patchMovedBarrage(state, player, DELTA_SECONDS);

    expect(barrage.cannons).toEqual(
      nextCannons(state.cannons, player, DELTA_SECONDS).cannons,
    );
  });

  it('should put the moved cannonballs before the newly fired ones when a cannon fires', () => {
    const state = createState(
      [createCannon(LOADED_RELOAD_SECONDS)],
      [
        createCannonball(CANNONBALL_INSIDE_X),
        createCannonball(CANNONBALL_LEAVING_X),
      ],
    );
    const player = createPlayerAt(PLAYER_RIGHT_OF_CANNON_X);

    const barrage = patchMovedBarrage(state, player, DELTA_SECONDS);

    expect(barrage.cannonballs).toEqual([
      ...nextCannonballs(state.cannonballs, LEVEL, DELTA_SECONDS),
      ...nextCannons(state.cannons, player, DELTA_SECONDS).cannonballs,
    ]);
  });

  it('should fly the old cannonball on, drop the one leaving the level and add the fired one when a loaded cannon sees the player', () => {
    const state = createState(
      [createCannon(LOADED_RELOAD_SECONDS)],
      [
        createCannonball(CANNONBALL_INSIDE_X),
        createCannonball(CANNONBALL_LEAVING_X),
      ],
    );

    const barrage = patchMovedBarrage(
      state,
      createPlayerAt(PLAYER_RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage.cannons).toEqual([
      {
        kind: 'REGULAR',
        barrelAngle: 0,
        roundIndex: 0,
        position: { x: CANNON_X, y: CANNON_Y },
        timers: { reload: CANNON_RELOAD_SECONDS },
        statuses: { isFacingRight: true },
      },
    ]);
    expect(size(barrage.cannonballs)).toBe(EXPECTED_CANNONBALLS);
    expect(barrage.cannonballs[0].position.x).toBeCloseTo(
      MOVED_CANNONBALL_X,
      PRECISION,
    );
    expect(barrage.cannonballs[1]).toEqual({
      position: { x: FIRED_CANNONBALL_X, y: FIRED_CANNONBALL_Y },
      velocity: {
        x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
        y: { current: 0, max: CANNONBALL_SPEED },
      },
    });
  });

  it('should aim the cannons at the given player rather than the one in the game when they differ', () => {
    const state = createState([createCannon(LOADING_RELOAD_SECONDS)], []);

    const barrage = patchMovedBarrage(
      state,
      createPlayerAt(PLAYER_RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage.cannons[0].statuses.isFacingRight).toBe(true);
  });

  it('should give no cannons and no cannonballs when the level has none', () => {
    const state = createState([], []);

    const barrage = patchMovedBarrage(
      state,
      createPlayerAt(PLAYER_RIGHT_OF_CANNON_X),
      DELTA_SECONDS,
    );

    expect(barrage).toEqual({ cannons: [], cannonballs: [] });
  });

  it('should leave the game and the player it was handed untouched when the barrage moves', () => {
    const state = createState(
      [createCannon(LOADED_RELOAD_SECONDS)],
      [createCannonball(CANNONBALL_INSIDE_X)],
    );
    const player = createPlayerAt(PLAYER_RIGHT_OF_CANNON_X);

    patchMovedBarrage(state, player, DELTA_SECONDS);

    expect(state).toEqual(
      createState(
        [createCannon(LOADED_RELOAD_SECONDS)],
        [createCannonball(CANNONBALL_INSIDE_X)],
      ),
    );
    expect(player).toEqual(createPlayerAt(PLAYER_RIGHT_OF_CANNON_X));
  });
});
