import { describe, expect, it } from 'vitest';

import { toEnemyKind } from './to-enemy-kind';

describe('toEnemyKind', () => {
  it('should give a flying enemy when the enemy starts in the air with horns', () => {
    const kind = toEnemyKind(true, true);

    expect(kind).toBe('FLYING');
  });

  it('should give a flying enemy when the enemy starts in the air without horns', () => {
    const kind = toEnemyKind(true, false);

    expect(kind).toBe('FLYING');
  });

  it('should give a horned enemy when the enemy starts on the ground with horns', () => {
    const kind = toEnemyKind(false, true);

    expect(kind).toBe('HORNED');
  });

  it('should give a hopping enemy when the enemy starts on the ground without horns', () => {
    const kind = toEnemyKind(false, false);

    expect(kind).toBe('HOPPING');
  });
});
