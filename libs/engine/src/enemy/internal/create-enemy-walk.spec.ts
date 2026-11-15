import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { createEnemyWalk } from './create-enemy-walk';

const OPEN_NEXT_LEFT = 43;
const BLOCKED_NEXT_LEFT = 40;

const OPEN_MOVE = { position: OPEN_NEXT_LEFT, isBlocked: false };

const BLOCKED_MOVE = { position: BLOCKED_NEXT_LEFT, isBlocked: true };

describe('createEnemyWalk', () => {
  it('should give the new position as the next x when the move is made', () => {
    const walk = createEnemyWalk(FACING_RIGHT, OPEN_MOVE);

    expect(walk.nextX).toBe(OPEN_NEXT_LEFT);
  });

  it('should keep the facing when the move is not blocked', () => {
    const walk = createEnemyWalk(FACING_RIGHT, OPEN_MOVE);

    expect(walk.facing).toBe(FACING_RIGHT);
  });

  it('should turn the enemy round when the move is blocked', () => {
    const walk = createEnemyWalk(FACING_RIGHT, BLOCKED_MOVE);

    expect(walk.facing).toBe(FACING_LEFT);
  });

  it('should turn the enemy back to the right when it walks left into something', () => {
    const walk = createEnemyWalk(FACING_LEFT, BLOCKED_MOVE);

    expect(walk.facing).toBe(FACING_RIGHT);
  });

  it('should stop the enemy where the blocked move left it when the move is blocked', () => {
    const walk = createEnemyWalk(FACING_RIGHT, BLOCKED_MOVE);

    expect(walk.nextX).toBe(BLOCKED_NEXT_LEFT);
  });

  it('should leave the move unchanged when it builds the walk', () => {
    createEnemyWalk(FACING_RIGHT, OPEN_MOVE);

    expect(OPEN_MOVE).toEqual({ position: OPEN_NEXT_LEFT, isBlocked: false });
  });
});
