import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isIceball } from './is-iceball';

const createFireball = (kind: Fireball['kind']): Fireball => ({
  kind,
  spin: 'CLOCKWISE',
  origin: { x: 100, y: 100 },
  angle: 0,
});

describe('isIceball', () => {
  it('should call the ball an ice one when it was hung on an ice ball block', () => {
    expect(isIceball(createFireball('ICE'))).toBe(true);
  });

  it('should not call the ball an ice one when it burns', () => {
    expect(isIceball(createFireball('FIRE'))).toBe(false);
  });
});
