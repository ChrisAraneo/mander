import { describe, expect, it } from 'vitest';

import { toGroundEnemyKind } from './to-ground-enemy-kind';

describe('toGroundEnemyKind', () => {
  it('should give a horned enemy when the enemy on the ground has horns', () => {
    const kind = toGroundEnemyKind(true, false, false);

    expect(kind).toBe('HORNED');
  });

  it('should give a hopping enemy when the enemy on the ground has no horns', () => {
    const kind = toGroundEnemyKind(false, false, false);

    expect(kind).toBe('HOPPING');
  });

  it('should give a fast enemy when the enemy on the ground is fast and has horns', () => {
    const kind = toGroundEnemyKind(true, true, false);

    expect(kind).toBe('FAST');
  });

  it('should give a fast enemy when the enemy on the ground is fast and has no horns', () => {
    const kind = toGroundEnemyKind(false, true, false);

    expect(kind).toBe('FAST');
  });

  it('should give a shooter enemy when the enemy on the ground shoots and has no horns', () => {
    const kind = toGroundEnemyKind(false, false, true);

    expect(kind).toBe('SHOOTER');
  });

  it('should give a shooter enemy when the enemy on the ground shoots and has horns', () => {
    const kind = toGroundEnemyKind(true, false, true);

    expect(kind).toBe('SHOOTER');
  });

  it('should give a shooter enemy when the enemy on the ground shoots and is fast', () => {
    const kind = toGroundEnemyKind(false, true, true);

    expect(kind).toBe('SHOOTER');
  });
});
