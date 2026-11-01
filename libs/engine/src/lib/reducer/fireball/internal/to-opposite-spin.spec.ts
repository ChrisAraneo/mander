import { describe, expect, it } from 'vitest';

import { toOppositeSpin } from './to-opposite-spin';

describe('toOppositeSpin', () => {
  it('should turn the ball the other way when it spins clockwise', () => {
    expect(toOppositeSpin('CLOCKWISE')).toBe('ANTICLOCKWISE');
  });

  it('should turn the ball the other way when it spins anticlockwise', () => {
    expect(toOppositeSpin('ANTICLOCKWISE')).toBe('CLOCKWISE');
  });

  it('should bring the ball back to its own spin when it is flipped twice', () => {
    expect(toOppositeSpin(toOppositeSpin('CLOCKWISE'))).toBe('CLOCKWISE');
  });
});
