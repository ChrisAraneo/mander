import { describe, expect, it } from 'vitest';

import { ENEMY_MOVE_SPEED, FAST_ENEMY_MOVE_SPEED } from '../consts';
import { getEnemyMoveSpeed } from './get-enemy-move-speed';

describe('getEnemyMoveSpeed', () => {
  it('should give no walking speed when the enemy flies', () => {
    const moveSpeed = getEnemyMoveSpeed('FLYING');

    expect(moveSpeed).toBe(0);
  });

  it('should give the usual walking speed when the enemy hops', () => {
    const moveSpeed = getEnemyMoveSpeed('HOPPING');

    expect(moveSpeed).toBe(ENEMY_MOVE_SPEED);
  });

  it('should give the usual walking speed when the enemy is horned', () => {
    const moveSpeed = getEnemyMoveSpeed('HORNED');

    expect(moveSpeed).toBe(ENEMY_MOVE_SPEED);
  });

  it('should give the fast walking speed when the enemy is fast', () => {
    const moveSpeed = getEnemyMoveSpeed('FAST');

    expect(moveSpeed).toBe(FAST_ENEMY_MOVE_SPEED);
  });

  it('should give 1.75 times the horned walking speed when the enemy is fast', () => {
    const moveSpeed = getEnemyMoveSpeed('FAST');

    expect(moveSpeed).toBe(getEnemyMoveSpeed('HORNED') * 1.75);
  });

  it('should give the usual walking speed when the enemy is a beartrap', () => {
    const moveSpeed = getEnemyMoveSpeed('BEARTRAP');

    expect(moveSpeed).toBe(ENEMY_MOVE_SPEED);
  });
});
