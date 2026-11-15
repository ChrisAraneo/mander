import { describe, expect, it } from 'vitest';

import { BEARTRAP_JUMP_VELOCITY } from '../consts';
import { createBeartrap } from './create-beartrap';

describe('createBeartrap', () => {
  it('should set a still beartrap on the point when it is given a point', () => {
    const beartrap = createBeartrap({ x: 37, y: 42 });

    expect(beartrap).toEqual({
      kind: 'BEARTRAP',
      position: { x: 37, y: 42 },
      velocity: {
        x: { current: 0, max: 0 },
        y: { current: 0, max: BEARTRAP_JUMP_VELOCITY },
      },
      timers: { death: null, reload: 0 },
      spawn: { x: 37, y: 42 },
      statuses: { isFacingRight: true, isGrounded: false },
    });
  });

  it('should give the beartrap its own copies of the point when it is given a point', () => {
    const point = { x: 37, y: 42 };

    const beartrap = createBeartrap(point);

    expect(beartrap.position).not.toBe(point);
    expect(beartrap.spawn).not.toBe(point);
    expect(beartrap.position).not.toBe(beartrap.spawn);
  });

  it('should not change the old point when it sets the beartrap', () => {
    const point = { x: 37, y: 42 };

    createBeartrap(point);

    expect(point).toEqual({ x: 37, y: 42 });
  });

  it('should set the beartrap at the corner when the point is at zero', () => {
    const beartrap = createBeartrap({ x: 0, y: 0 });

    expect(beartrap.position).toEqual({ x: 0, y: 0 });
    expect(beartrap.spawn).toEqual({ x: 0, y: 0 });
  });
});
