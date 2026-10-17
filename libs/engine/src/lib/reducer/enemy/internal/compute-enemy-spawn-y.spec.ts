import { describe, expect, it } from 'vitest';

import { computeEnemySpawnY } from './compute-enemy-spawn-y';

describe('computeEnemySpawnY', () => {
  it('should stand the enemy on the bottom of its spawn tile when the tile is inside the level', () => {
    const spawnY = computeEnemySpawnY({ x: 3, y: 2 });

    expect(spawnY).toBe(74);
  });

  it('should stand the enemy on the bottom of its spawn tile when the tile is in the top row', () => {
    const spawnY = computeEnemySpawnY({ x: 0, y: 0 });

    expect(spawnY).toBe(10);
  });
});
