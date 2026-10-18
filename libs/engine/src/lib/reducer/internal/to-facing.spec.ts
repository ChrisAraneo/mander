import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../consts';
import { toFacing } from './to-facing';

describe('toFacing', () => {
  it('should give the right facing when the player faces right', () => {
    const facing = toFacing(true);

    expect(facing).toBe(FACING_RIGHT);
  });

  it('should give the left facing when the player faces left', () => {
    const facing = toFacing(false);

    expect(facing).toBe(FACING_LEFT);
  });
});
