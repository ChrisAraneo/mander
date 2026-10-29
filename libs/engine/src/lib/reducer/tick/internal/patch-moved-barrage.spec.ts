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

import { createInitialState } from '../../../state/create-initial-state';
import type { GameLevel } from '../../../types/game-level';
import type { GameState } from '../../../types/game-state';
import { CANNON_RELOAD_SECONDS, CANNONBALL_SPEED } from '../../cannon/consts';
import { nextCannonballs } from '../../cannon/next-cannonballs';
import { nextCannons } from '../../cannon/next-cannons';
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
  shooterEnemyChance: 0,
});

const LEVEL = createLevel([
  repeat('.', 40),
  repeat('.', 40),
  `s${repeat('.', 39)}`,
  repeat('#', 40),
]);

const createCannon = (reload: number): Cannon => ({
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight: false },
});

const createCannonball = (left: number): Cannonball => ({
  position: { x: left, y: 10 },
  velocity: { x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED } },
});

const createState = (
  cannons: Cannon[],
  cannonballs: Cannonball[],
): GameState => ({
  ...createInitialState(LEVEL, 0, []),
  cannons,
  cannonballs,
});

const createPlayerAt = (left: number): Player => ({
  ...createInitialState(LEVEL, 0, []).player,
  position: { x: left, y: 56 },
});

describe('patchMovedBarrage', () => {
  it('should give the cannons as the cannons move them when the player is near', () => {
    const state = createState([createCannon(0.02), createCannon(10)], []);
    const player = createPlayerAt(400);

    const barrage = patchMovedBarrage(state, player, 0.02);

    expect(barrage.cannons).toEqual(
      nextCannons(state.cannons, player, 0.02).cannons,
    );
  });

  it('should put the moved cannonballs before the newly fired ones when a cannon fires', () => {
    const state = createState(
      [createCannon(0.02)],
      [createCannonball(100), createCannonball(1280)],
    );
    const player = createPlayerAt(400);

    const barrage = patchMovedBarrage(state, player, 0.02);

    expect(barrage.cannonballs).toEqual([
      ...nextCannonballs(LEVEL, state.cannonballs, 0.02),
      ...nextCannons(state.cannons, player, 0.02).cannonballs,
    ]);
  });

  it('should fly the old cannonball on, drop the one leaving the level and add the fired one when a loaded cannon sees the player', () => {
    const state = createState(
      [createCannon(0.02)],
      [createCannonball(100), createCannonball(1280)],
    );

    const barrage = patchMovedBarrage(state, createPlayerAt(400), 0.02);

    expect(barrage.cannons).toEqual([
      {
        position: { x: 320, y: 64 },
        timers: { reload: CANNON_RELOAD_SECONDS },
        statuses: { isFacingRight: true },
      },
    ]);
    expect(size(barrage.cannonballs)).toBe(2);
    expect(barrage.cannonballs[0].position.x).toBeCloseTo(104.4, 6);
    expect(barrage.cannonballs[1]).toEqual({
      position: { x: 330, y: 74 },
      velocity: { x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED } },
    });
  });

  it('should aim the cannons at the given player rather than the one in the game when they differ', () => {
    const state = createState([createCannon(10)], []);

    const barrage = patchMovedBarrage(state, createPlayerAt(400), 0.02);

    expect(barrage.cannons[0].statuses.isFacingRight).toBe(true);
  });

  it('should give no cannons and no cannonballs when the level has none', () => {
    const state = createState([], []);

    const barrage = patchMovedBarrage(state, createPlayerAt(400), 0.02);

    expect(barrage).toEqual({ cannons: [], cannonballs: [] });
  });

  it('should leave the given game and player alone when the barrage moves', () => {
    const state = createState([createCannon(0.02)], [createCannonball(100)]);
    const player = createPlayerAt(400);

    patchMovedBarrage(state, player, 0.02);

    expect(state).toEqual(
      createState([createCannon(0.02)], [createCannonball(100)]),
    );
    expect(player).toEqual(createPlayerAt(400));
  });
});
