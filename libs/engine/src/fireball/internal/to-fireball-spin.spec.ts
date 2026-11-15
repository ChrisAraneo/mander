import { describe, expect, it } from 'vitest';

import { toFireballSpin } from './to-fireball-spin';

describe('toFireballSpin', () => {
  it('should give an anticlockwise spin when the fireball turns anticlockwise', () => {
    const spin = toFireballSpin(true);

    expect(spin).toBe('ANTICLOCKWISE');
  });

  it('should give a clockwise spin when the fireball does not turn anticlockwise', () => {
    const spin = toFireballSpin(false);

    expect(spin).toBe('CLOCKWISE');
  });
});
