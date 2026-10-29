import {
  type Cannon,
  type Player,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { GameLevel } from '../../types/game-level';
import { BASE_HEARTS } from '../player/consts';
import { createPlayer } from '../player/create-player';
import { CANNON_RELOAD_SECONDS, CANNONBALL_SPEED } from './consts';
import { nextCannons } from './next-cannons';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const createLevel = (rows: string[]): GameLevel => ({
  seed: 'SEED',
  width: size(head(rows)),
  height: size(rows),
  tiles: map(rows, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
});

const LEVEL = createLevel(['.....', '.....', '#####']);

const BASE_PLAYER = createPlayer(LEVEL, { hearts: { value: BASE_HEARTS } });

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: 56 },
});

const createCannon = (reload: number, isFacingRight: boolean): Cannon => ({
  position: { x: 320, y: 64 },
  timers: { reload },
  statuses: { isFacingRight },
});

const computeFacings = (cannons: Cannon[]): boolean[] =>
  map(cannons, (cannon) => cannon.statuses.isFacingRight);

describe('nextCannons', () => {
  it('should turn the cannon to the right when the player stands to its right', () => {
    const cannons = [createCannon(10, false)];

    const barrage = nextCannons(cannons, createPlayerAt(400), 0.02);

    expect(computeFacings(barrage.cannons)).toEqual([true]);
  });

  it('should turn the cannon to the left when the player stands to its left', () => {
    const cannons = [createCannon(10, true)];

    const barrage = nextCannons(cannons, createPlayerAt(200), 0.02);

    expect(computeFacings(barrage.cannons)).toEqual([false]);
  });

  it('should turn the cannon to the right when the centre of the player is level with the centre of the cannon', () => {
    const cannons = [createCannon(10, false)];

    const barrage = nextCannons(cannons, createPlayerAt(325), 0.02);

    expect(computeFacings(barrage.cannons)).toEqual([true]);
  });

  it('should fire one cannonball and reload when the player is in range and the cannon has just loaded', () => {
    const cannons = [createCannon(0.02, false)];

    const barrage = nextCannons(cannons, createPlayerAt(400), 0.02);

    expect(barrage).toEqual({
      cannons: [
        {
          position: { x: 320, y: 64 },
          timers: { reload: CANNON_RELOAD_SECONDS },
          statuses: { isFacingRight: true },
        },
      ],
      cannonballs: [
        {
          position: { x: 330, y: 74 },
          velocity: { x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED } },
        },
      ],
    });
  });

  it('should carry the time it overshot into the next reload when the cannon fires', () => {
    const cannons = [createCannon(0.01, true)];

    const barrage = nextCannons(cannons, createPlayerAt(400), 0.02);

    expect(barrage.cannons[0].timers.reload).toBeCloseTo(
      0.01 - 0.02 + CANNON_RELOAD_SECONDS,
      6,
    );
    expect(barrage.cannons[0].timers.reload).toBeCloseTo(3.49, 6);
    expect(size(barrage.cannonballs)).toBe(1);
  });

  it('should fire the cannonball to the left when the player is in range to the left', () => {
    const cannons = [createCannon(0, true)];

    const barrage = nextCannons(cannons, createPlayerAt(200), 0.02);

    expect(barrage.cannonballs[0].velocity.x.current).toBe(-CANNONBALL_SPEED);
  });

  it('should fire when the player stands exactly at the far end of the range', () => {
    const cannons = [createCannon(0, true)];

    const barrage = nextCannons(cannons, createPlayerAt(965), 0.02);

    expect(size(barrage.cannonballs)).toBe(1);
  });

  it('should fire nothing and count down the reload when the player is in range but the cannon is still loading', () => {
    const cannons = [createCannon(10, true)];

    const barrage = nextCannons(cannons, createPlayerAt(400), 0.02);

    expect(barrage.cannonballs).toEqual([]);
    expect(barrage.cannons[0].timers.reload).toBeCloseTo(9.98, 6);
  });

  it('should fire nothing and keep the reload when the player is out of range', () => {
    const cannons = [createCannon(0, false)];

    const barrage = nextCannons(cannons, createPlayerAt(1100), 0.5);

    expect(barrage).toEqual({
      cannons: [
        {
          position: { x: 320, y: 64 },
          timers: { reload: 0 },
          statuses: { isFacingRight: true },
        },
      ],
      cannonballs: [],
    });
  });

  it('should fire nothing when the player stands just past the far end of the range', () => {
    const cannons = [createCannon(0, true)];

    const barrage = nextCannons(cannons, createPlayerAt(966), 0.02);

    expect(barrage.cannonballs).toEqual([]);
    expect(barrage.cannons[0].timers.reload).toBe(0);
  });

  it('should fire only from the cannons that are loaded when several cannons see the player', () => {
    const cannons = [createCannon(10, true), createCannon(0, true)];

    const barrage = nextCannons(cannons, createPlayerAt(400), 0.02);

    expect(size(barrage.cannons)).toBe(2);
    expect(size(barrage.cannonballs)).toBe(1);
    expect(barrage.cannons[0].timers.reload).toBeCloseTo(9.98, 6);
    expect(barrage.cannons[1].timers.reload).toBeCloseTo(3.48, 6);
  });

  it('should give no cannons and no cannonballs when the level has no cannons', () => {
    const barrage = nextCannons([], createPlayerAt(400), 0.02);

    expect(barrage).toEqual({ cannons: [], cannonballs: [] });
  });

  it('should leave the given cannons and the player alone when it moves them on', () => {
    const cannons = [createCannon(0, false), createCannon(10, true)];
    const player = createPlayerAt(400);

    nextCannons(cannons, player, 0.02);

    expect(cannons).toEqual([createCannon(0, false), createCannon(10, true)]);
    expect(player).toEqual(createPlayerAt(400));
  });
});
