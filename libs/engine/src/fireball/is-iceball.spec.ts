import type { Fireball, FireballKind } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isIceball } from './is-iceball';

const BLOCK_LEFT = 100;

const BLOCK_TOP = 100;

const createFireball = (kind: FireballKind): Fireball => ({
  kind,
  spin: 'CLOCKWISE',
  origin: { x: BLOCK_LEFT, y: BLOCK_TOP },
  angle: 0,
});

describe('isIceball', () => {
  it('should call the ball an ice one when it was hung on an ice ball block', () => {
    expect(isIceball(createFireball('ICE'))).toBe(true);
  });

  it('should not call the ball an ice one when it burns', () => {
    expect(isIceball(createFireball('FIRE'))).toBe(false);
  });

  it('should not call the ball an ice one when it is a pink ball', () => {
    expect(isIceball(createFireball('PINK'))).toBe(false);
  });

  it('should leave the ball unchanged when it looks at what it is', () => {
    const fireball = createFireball('ICE');

    isIceball(fireball);

    expect(fireball).toEqual(createFireball('ICE'));
  });
});
