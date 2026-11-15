import { describe, expect, it } from 'vitest';

import { PLAYER_MAX_JUMP_VELOCITY, PLAYER_MAX_MOVE_VELOCITY } from './consts';
import { createBasePlayerVelocity } from './create-base-player-velocity';

describe('createBasePlayerVelocity', () => {
  it('should give a still player the top running and jumping speeds when it is called', () => {
    const velocity = createBasePlayerVelocity();

    expect(velocity).toEqual({
      x: { current: 0, max: PLAYER_MAX_MOVE_VELOCITY },
      y: { current: 0, max: PLAYER_MAX_JUMP_VELOCITY },
    });
  });

  it('should give a new velocity each time when it is called twice', () => {
    const first = createBasePlayerVelocity();
    const second = createBasePlayerVelocity();

    expect(first).not.toBe(second);
    expect(first.x).not.toBe(second.x);
    expect(first.y).not.toBe(second.y);
  });
});
