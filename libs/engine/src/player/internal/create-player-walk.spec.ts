import { describe, expect, it } from 'vitest';

import type { AxisMove } from '../../collision/types/axis-move';
import { createPlayerWalk } from './create-player-walk';

const WALK_LEFT = 48.4;

const RUN_SPEED = 210;

const STOPPED_SPEED = 0;

const OPEN_MOVE: AxisMove = { position: WALK_LEFT, isBlocked: false };

const BLOCKED_MOVE: AxisMove = { position: WALK_LEFT, isBlocked: true };

describe('createPlayerWalk', () => {
  it('should take the new position as the place the player walks to when the way is clear', () => {
    const walk = createPlayerWalk(OPEN_MOVE, RUN_SPEED);

    expect(walk.nextX).toBe(WALK_LEFT);
  });

  it('should keep the speed the player was running at when the way is clear', () => {
    const walk = createPlayerWalk(OPEN_MOVE, RUN_SPEED);

    expect(walk.blockedVelocityX).toBe(RUN_SPEED);
  });

  it('should stop the player dead when a wall is in the way', () => {
    const walk = createPlayerWalk(BLOCKED_MOVE, RUN_SPEED);

    expect(walk.blockedVelocityX).toBe(STOPPED_SPEED);
  });

  it('should still take the new position when a wall is in the way', () => {
    const walk = createPlayerWalk(BLOCKED_MOVE, RUN_SPEED);

    expect(walk.nextX).toBe(WALK_LEFT);
  });
});
