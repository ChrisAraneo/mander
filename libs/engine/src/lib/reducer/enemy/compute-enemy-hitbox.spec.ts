import type { Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeEnemyHitbox } from './compute-enemy-hitbox';
import { ENEMY_HEIGHT, ENEMY_HITBOX_INSET, ENEMY_WIDTH } from './consts';

const createHoppingEnemy = (): Enemy => ({
  kind: 'HOPPING',
  position: { x: 100, y: 200 },
  velocity: { x: { current: 0, max: 0 }, y: { current: 0, max: 0 } },
  timers: { death: null, reload: 0 },
  spawn: { x: 100, y: 200 },
  statuses: { isFacingRight: true, isGrounded: true },
});

describe('computeEnemyHitbox', () => {
  it('should give left = position.x + ENEMY_HITBOX_INSET and right = position.x + ENEMY_WIDTH - ENEMY_HITBOX_INSET when it is given an enemy', () => {
    const enemy = createHoppingEnemy();

    const hitbox = computeEnemyHitbox(enemy);

    expect(hitbox.left).toBe(100 + ENEMY_HITBOX_INSET);
    expect(hitbox.right).toBe(100 + ENEMY_WIDTH - ENEMY_HITBOX_INSET);
    expect(hitbox.left).toBe(103);
    expect(hitbox.right).toBe(119);
  });

  it('should give top = position.y + ENEMY_HITBOX_INSET and bottom = position.y + ENEMY_HEIGHT - ENEMY_HITBOX_INSET when it is given an enemy', () => {
    const enemy = createHoppingEnemy();

    const hitbox = computeEnemyHitbox(enemy);

    expect(hitbox.top).toBe(200 + ENEMY_HITBOX_INSET);
    expect(hitbox.bottom).toBe(200 + ENEMY_HEIGHT - ENEMY_HITBOX_INSET);
    expect(hitbox.top).toBe(203);
    expect(hitbox.bottom).toBe(219);
  });

  it('should leave the enemy unchanged when it builds the hitbox', () => {
    const enemy = createHoppingEnemy();

    computeEnemyHitbox(enemy);

    expect(enemy).toEqual(createHoppingEnemy());
  });
});
