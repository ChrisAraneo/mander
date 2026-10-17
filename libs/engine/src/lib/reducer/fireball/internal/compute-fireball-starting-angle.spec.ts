import { describe, expect, it } from 'vitest';

import { FIREBALL_STAGGER_ANGLE, FIREBALL_STAGGER_STEPS } from '../consts';
import { computeFireballStartingAngle } from './compute-fireball-starting-angle';

describe('computeFireballStartingAngle', () => {
  it('should start the fireball at the stagger angle of the tile when the tile sits in the level', () => {
    const angle = computeFireballStartingAngle({ x: 3, y: 2 });

    expect(angle).toBeCloseTo(
      ((3 + 2) % FIREBALL_STAGGER_STEPS) * FIREBALL_STAGGER_ANGLE,
      6,
    );
    expect(angle).toBeCloseTo(Math.PI / 2, 6);
  });

  it('should start the fireball at zero when the tile is in the top left corner', () => {
    const angle = computeFireballStartingAngle({ x: 0, y: 0 });

    expect(angle).toBe(0);
  });

  it('should start the fireball again at zero when the column and row add up to a full stagger', () => {
    const angle = computeFireballStartingAngle({ x: 2, y: 2 });

    expect(angle).toBe(0);
  });

  it('should start the fireball at the last stagger angle when the column and row add up to one less than a full stagger', () => {
    const angle = computeFireballStartingAngle({ x: 1, y: 6 });

    expect(angle).toBeCloseTo((3 * Math.PI) / 2, 6);
  });
});
