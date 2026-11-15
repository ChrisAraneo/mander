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

import { BASE_HEARTS } from '../../player/consts';
import { createPlayer } from '../../player/create-player';
import type { GameLevel } from '../../state/types/game-level';
import { createCannonTickShots } from './create-cannon-tick-shots';

const LEGEND: Record<string, Tile> = { '.': TILE_AIR, '#': TILE_DIRT };

const CANNON_LEFT = 10 * TILE_SIZE;
const CANNON_TOP = 2 * TILE_SIZE;
const PLAYER_TOP = 56;
const NEAR_LEFT = 400;
const FAR_LEFT = 1100;
const DELTA_SECONDS = 0.5;

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

const createPlayerAt = (left: number): Player => ({
  ...BASE_PLAYER,
  position: { x: left, y: PLAYER_TOP },
});

const createCannons = (): Cannon[] => [
  {
    kind: 'REGULAR',
    barrelAngle: 0,
    roundIndex: 0,
    position: { x: CANNON_LEFT, y: CANNON_TOP },
    timers: { reload: 0 },
    statuses: { isFacingRight: false },
  },
];

describe('createCannonTickShots', () => {
  it('should fire a shot for the cannon when the player is in range', () => {
    const shots = createCannonTickShots({
      cannons: createCannons(),
      player: createPlayerAt(NEAR_LEFT),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(size(shots.shots)).toBe(1);
    expect(shots.shots[0].cannonball).not.toBeUndefined();
  });

  it('should fire nothing when the player is out of range', () => {
    const shots = createCannonTickShots({
      cannons: createCannons(),
      player: createPlayerAt(FAR_LEFT),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(shots.shots[0].cannonball).toBeUndefined();
  });

  it('should turn the cannon towards the player when the player is in range', () => {
    const shots = createCannonTickShots({
      cannons: createCannons(),
      player: createPlayerAt(NEAR_LEFT),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(shots.shots[0].cannon.statuses.isFacingRight).toBe(true);
  });

  it('should give no shots when there are no cannons', () => {
    const shots = createCannonTickShots({
      cannons: [],
      player: createPlayerAt(NEAR_LEFT),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(shots.shots).toEqual([]);
  });

  it('should not change the cannons it was given when it fires them', () => {
    const cannons = createCannons();

    createCannonTickShots({
      cannons,
      player: createPlayerAt(NEAR_LEFT),
      deltaSeconds: DELTA_SECONDS,
    });

    expect(cannons).toEqual(createCannons());
  });
});
