import { type Enemy, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createHeldFreezingShot } from './create-held-freezing-shot';

const ENEMY_LEFT = 10 * TILE_SIZE;
const ENEMY_TOP = 2 * TILE_SIZE;
const ENEMY_TOP_MOVE_SPEED = 39;
const ENEMY_TOP_FALL_SPEED = 301;

const FREEZER: Enemy = {
  kind: 'FREEZING',
  position: { x: ENEMY_LEFT, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: ENEMY_TOP_MOVE_SPEED },
    y: { current: 0, max: ENEMY_TOP_FALL_SPEED },
  },
  timers: { death: null, reload: 2 },
  spawn: { x: ENEMY_LEFT, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
};

describe('createHeldFreezingShot', () => {
  it('should hand back the same freezing enemy when the throw is held', () => {
    const shot = createHeldFreezingShot(FREEZER);

    expect(shot.enemy).toBe(FREEZER);
  });

  it('should throw nothing when the throw is held', () => {
    const shot = createHeldFreezingShot(FREEZER);

    expect(shot.snowball).toBeUndefined();
  });
});
