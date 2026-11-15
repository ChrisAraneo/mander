import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { computeFlyingEnemyFacing } from './compute-flying-enemy-facing';

const RESTING_SPEED = 0;
const RISE_SPEED = -120;
const FALL_SPEED = 120;

describe('computeFlyingEnemyFacing', () => {
  it('should say the enemy is heading up when it moves upwards', () => {
    expect(computeFlyingEnemyFacing(RISE_SPEED)).toBe(FACING_LEFT);
  });

  it('should say the enemy is heading down when it moves downwards', () => {
    expect(computeFlyingEnemyFacing(FALL_SPEED)).toBe(FACING_RIGHT);
  });

  it('should say the enemy is heading down when it is not moving up or down', () => {
    expect(computeFlyingEnemyFacing(RESTING_SPEED)).toBe(FACING_RIGHT);
  });
});
