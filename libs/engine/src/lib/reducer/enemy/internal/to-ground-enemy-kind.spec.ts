import { describe, expect, it } from 'vitest';

import { toGroundEnemyKind } from './to-ground-enemy-kind';

describe('toGroundEnemyKind', () => {
  it('should give a horned enemy when the enemy on the ground has horns', () => {
    const kind = toGroundEnemyKind(true);

    expect(kind).toBe('HORNED');
  });

  it('should give a hopping enemy when the enemy on the ground has no horns', () => {
    const kind = toGroundEnemyKind(false);

    expect(kind).toBe('HOPPING');
  });
});
