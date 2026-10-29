import type { Cannon, Cannonball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SPEED } from '../../cannon/consts';
import type { Barrage } from '../../cannon/types/barrage';
import type { Salvo } from '../../enemy/types/salvo';
import { addSalvoCannonballs } from './add-salvo-cannonballs';

const CANNON: Cannon = {
  position: { x: 320, y: 64 },
  timers: { reload: 2 },
  statuses: { isFacingRight: true },
};

const createCannonball = (left: number): Cannonball => ({
  position: { x: left, y: 10 },
  velocity: { x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED } },
});

const createBarrage = (cannonballs: Cannonball[]): Barrage => ({
  cannons: [CANNON],
  cannonballs,
});

const createSalvo = (cannonballs: Cannonball[]): Salvo => ({
  enemies: [],
  cannonballs,
});

describe('addSalvoCannonballs', () => {
  it('should keep the cannons of the barrage when the salvo is added', () => {
    const added = addSalvoCannonballs(createBarrage([]), createSalvo([]));

    expect(added.cannons).toEqual([CANNON]);
  });

  it('should put the shooter cannonballs after the cannon ones when both fired', () => {
    const added = addSalvoCannonballs(
      createBarrage([createCannonball(10)]),
      createSalvo([createCannonball(20)]),
    );

    expect(added.cannonballs).toEqual([
      createCannonball(10),
      createCannonball(20),
    ]);
  });

  it('should keep the barrage cannonballs alone when the shooters fired nothing', () => {
    const added = addSalvoCannonballs(
      createBarrage([createCannonball(10)]),
      createSalvo([]),
    );

    expect(added.cannonballs).toEqual([createCannonball(10)]);
  });

  it('should give only the shooter cannonballs when the cannons fired nothing', () => {
    const added = addSalvoCannonballs(
      createBarrage([]),
      createSalvo([createCannonball(20)]),
    );

    expect(added.cannonballs).toEqual([createCannonball(20)]);
  });
});
