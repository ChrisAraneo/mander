import { describe, expect, it } from 'vitest';

import { computeEnemySpawnX } from './compute-enemy-spawn-x';

describe('computeEnemySpawnX', () => {
  it('should centre the enemy across its spawn tile when the tile is inside the level', () => {
    const spawnX = computeEnemySpawnX({ x: 3, y: 2 });

    expect(spawnX).toBe(101);
  });

  it('should centre the enemy across its spawn tile when the tile is in the first column', () => {
    const spawnX = computeEnemySpawnX({ x: 0, y: 0 });

    expect(spawnX).toBe(5);
  });
});
