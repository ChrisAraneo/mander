import { type Cannon, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { CANNON_RELOAD_SECONDS, CANNON_RESTING_ANGLE } from '../consts';
import { createFiredCannonball } from '../create-fired-cannonball';
import { createFiredCannonShot } from './create-fired-cannon-shot';
import type { CannonRound } from './types/cannon-round';

const CANNON_LEFT = 10 * TILE_SIZE;
const CANNON_TOP = 2 * TILE_SIZE;
const OVERSHOT_SECONDS = -0.5;

const ROUND: CannonRound = {
  angle: CANNON_RESTING_ANGLE,
  reloadSeconds: CANNON_RELOAD_SECONDS,
};

const createCannon = (
  kind: Cannon['kind'],
  roundIndex: number,
  reload: number,
): Cannon => ({
  kind,
  barrelAngle: 0,
  roundIndex,
  position: { x: CANNON_LEFT, y: CANNON_TOP },
  timers: { reload },
  statuses: { isFacingRight: true },
});

describe('createFiredCannonShot', () => {
  it('should send a cannonball on its way when the cannon fires', () => {
    const cannon = createCannon('REGULAR', 0, 0);

    const shot = createFiredCannonShot(cannon, ROUND);

    expect(shot.cannonball).toEqual(createFiredCannonball(cannon, ROUND.angle));
  });

  it('should start the new reload when the cannon fires', () => {
    const shot = createFiredCannonShot(createCannon('REGULAR', 0, 0), ROUND);

    expect(shot.cannon.timers.reload).toBe(ROUND.reloadSeconds);
  });

  it('should carry the overshot time into the new reload when the cannon loaded a while ago', () => {
    const shot = createFiredCannonShot(
      createCannon('REGULAR', 0, OVERSHOT_SECONDS),
      ROUND,
    );

    expect(shot.cannon.timers.reload).toBe(
      OVERSHOT_SECONDS + ROUND.reloadSeconds,
    );
  });

  it('should move the cannon on to the next round when it fires', () => {
    const shot = createFiredCannonShot(createCannon('TRIPLE', 0, 0), ROUND);

    expect(shot.cannon.roundIndex).toBe(1);
  });

  it('should not change the cannon it was given when it fires', () => {
    const cannon = createCannon('REGULAR', 0, 0);

    createFiredCannonShot(cannon, ROUND);

    expect(cannon).toEqual(createCannon('REGULAR', 0, 0));
  });
});
