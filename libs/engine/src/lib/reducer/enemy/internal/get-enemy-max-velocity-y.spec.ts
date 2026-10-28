import { describe, expect, it } from 'vitest';

import {
  ENEMY_JUMP_VELOCITY,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_JUMP_VELOCITY,
} from '../consts';
import { getEnemyMaxVelocityY } from './get-enemy-max-velocity-y';

describe('getEnemyMaxVelocityY', () => {
  it('should give the lower horned jump when the enemy is horned', () => {
    const maxVelocityY = getEnemyMaxVelocityY('HORNED');

    expect(maxVelocityY).toBe(HORNED_ENEMY_JUMP_VELOCITY);
  });

  it('should give the lower horned jump when the enemy is fast', () => {
    const maxVelocityY = getEnemyMaxVelocityY('FAST');

    expect(maxVelocityY).toBe(HORNED_ENEMY_JUMP_VELOCITY);
  });

  it('should give the flying speed when the enemy flies', () => {
    const maxVelocityY = getEnemyMaxVelocityY('FLYING');

    expect(maxVelocityY).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should give the usual jump when the enemy hops', () => {
    const maxVelocityY = getEnemyMaxVelocityY('HOPPING');

    expect(maxVelocityY).toBe(ENEMY_JUMP_VELOCITY);
  });

  it('should give the usual jump when the enemy is a beartrap', () => {
    const maxVelocityY = getEnemyMaxVelocityY('BEARTRAP');

    expect(maxVelocityY).toBe(ENEMY_JUMP_VELOCITY);
  });
});
