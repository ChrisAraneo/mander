import type { Fireball } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { EMBER_FIREBALL, FROST_FIREBALL } from '../consts';
import { getFireballColors } from './get-fireball-colors';

const createFireball = (kind: Fireball['kind']): Fireball => ({
  kind,
  spin: 'CLOCKWISE',
  origin: { x: 64, y: 64 },
  angle: 0,
});

describe('getFireballColors', () => {
  it('should paint the ball in embers when it burns', () => {
    expect(getFireballColors(createFireball('FIRE'))).toBe(EMBER_FIREBALL);
  });

  it('should paint the ball in frost when it is an icy one', () => {
    expect(getFireballColors(createFireball('ICE'))).toBe(FROST_FIREBALL);
  });

  it('should keep the frost ball cyan when it paints one', () => {
    expect(FROST_FIREBALL.flame).toBe('#4FE3F2');
  });
});
