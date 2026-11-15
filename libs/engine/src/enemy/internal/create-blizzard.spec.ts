import type { Snowball, Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createBlizzard } from './create-blizzard';
import type { FreezingShot } from './types/freezing-shot';

const ENEMY_LEFT = 320;
const ENEMY_TOP = 64;
const AMMO_LEFT = 330;
const AMMO_TOP = 70;
const AMMO_SIZE = 12;
const AMMO_SPEED = 220;

const createEnemy = (left: number): Enemy => ({
  kind: 'FREEZING',
  position: { x: left, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: 0 },
    y: { current: 0, max: 0 },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: left, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

const AMMO = {
  position: { x: AMMO_LEFT, y: AMMO_TOP },
  velocity: {
    x: { current: AMMO_SPEED, max: AMMO_SPEED },
    y: { current: 0, max: 0 },
  },
  size: AMMO_SIZE,
} as unknown as Snowball;

const FIRED_SHOT: FreezingShot = {
  enemy: createEnemy(ENEMY_LEFT),
  snowball: AMMO,
};

const HELD_SHOT: FreezingShot = {
  enemy: createEnemy(ENEMY_LEFT),
  snowball: undefined,
};

describe('createBlizzard', () => {
  it('should gather every enemy when it is given shots', () => {
    const blizzard = createBlizzard([FIRED_SHOT, HELD_SHOT]);

    expect(blizzard.enemies).toEqual([FIRED_SHOT.enemy, HELD_SHOT.enemy]);
  });

  it('should gather only the ammunition that was fired when some shots were held', () => {
    const blizzard = createBlizzard([FIRED_SHOT, HELD_SHOT]);

    expect(blizzard.snowballs).toEqual([AMMO]);
  });

  it('should gather nothing when it is given no shots', () => {
    const blizzard = createBlizzard([]);

    expect(blizzard).toEqual({ enemies: [], snowballs: [] });
  });

  it('should leave the given shots unchanged when it gathers them', () => {
    createBlizzard([FIRED_SHOT, HELD_SHOT]);

    expect(FIRED_SHOT.snowball).toBe(AMMO);
    expect(HELD_SHOT.snowball).toBeUndefined();
  });
});
