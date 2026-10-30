import { describe, expect, it } from 'vitest';

import { toRolledEnemyKind } from './to-rolled-enemy-kind';

describe('toRolledEnemyKind', () => {
  it('should give a flying enemy when the enemy starts in the air with horns', () => {
    const kind = toRolledEnemyKind(true, true, false, false);

    expect(kind).toBe('FLYING');
  });

  it('should give a flying enemy when the enemy starts in the air without horns', () => {
    const kind = toRolledEnemyKind(true, false, false, false);

    expect(kind).toBe('FLYING');
  });

  it('should give a flying enemy when the enemy starts in the air and is fast', () => {
    const kind = toRolledEnemyKind(true, false, true, false);

    expect(kind).toBe('FLYING');
  });

  it('should give a flying enemy when the enemy starts in the air and shoots', () => {
    const kind = toRolledEnemyKind(true, false, false, true);

    expect(kind).toBe('FLYING');
  });

  it('should give a horned enemy when the enemy starts on the ground with horns', () => {
    const kind = toRolledEnemyKind(false, true, false, false);

    expect(kind).toBe('HORNED');
  });

  it('should give a hopping enemy when the enemy starts on the ground without horns', () => {
    const kind = toRolledEnemyKind(false, false, false, false);

    expect(kind).toBe('HOPPING');
  });

  it('should give a fast enemy when the enemy starts on the ground and is fast', () => {
    const kind = toRolledEnemyKind(false, true, true, false);

    expect(kind).toBe('FAST');
  });

  it('should give a shooter enemy when the enemy starts on the ground and shoots', () => {
    const kind = toRolledEnemyKind(false, false, false, true);

    expect(kind).toBe('SHOOTER');
  });
});
