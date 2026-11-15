import { type Cannon, type Cannonball, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNONBALL_SPEED } from '../consts';
import { createCannonBarrage } from './create-cannon-barrage';

const CANNON_LEFT = 10 * TILE_SIZE;
const CANNON_TOP = 2 * TILE_SIZE;

const CANNON: Cannon = {
  kind: 'REGULAR',
  barrelAngle: 0,
  roundIndex: 0,
  position: { x: CANNON_LEFT, y: CANNON_TOP },
  timers: { reload: 0 },
  statuses: { isFacingRight: true },
};

const CANNONBALL: Cannonball = {
  position: { x: CANNON_LEFT, y: CANNON_TOP },
  velocity: {
    x: { current: CANNONBALL_SPEED, max: CANNONBALL_SPEED },
    y: { current: 0, max: CANNONBALL_SPEED },
  },
};

describe('createCannonBarrage', () => {
  it('should gather the cannons and the balls they fired when the shots are given', () => {
    const barrage = createCannonBarrage({
      shots: [{ cannon: CANNON, cannonball: CANNONBALL }],
    });

    expect(barrage).toEqual({
      cannons: [CANNON],
      cannonballs: [CANNONBALL],
    });
  });

  it('should leave the balls out when no cannon fired', () => {
    const barrage = createCannonBarrage({
      shots: [{ cannon: CANNON, cannonball: undefined }],
    });

    expect(barrage.cannons).toEqual([CANNON]);
    expect(barrage.cannonballs).toEqual([]);
  });

  it('should give an empty barrage when there are no shots', () => {
    const barrage = createCannonBarrage({ shots: [] });

    expect(barrage).toEqual({ cannons: [], cannonballs: [] });
  });

  it('should hand back the same cannon when it gathers the barrage', () => {
    const barrage = createCannonBarrage({
      shots: [{ cannon: CANNON, cannonball: undefined }],
    });

    expect(barrage.cannons[0]).toBe(CANNON);
  });
});
