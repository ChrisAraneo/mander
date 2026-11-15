import { type Enemy, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  ENEMY_HEIGHT,
  ENEMY_HITBOX_INSET,
  ENEMY_WIDTH,
} from '../../enemy/consts';
import { computeEnemyBox } from './compute-enemy-box';

const ENEMY_LEFT = 3 * TILE_SIZE;
const ENEMY_TOP = 4 * TILE_SIZE;

const createEnemyAt = (left: number, top: number): Enemy =>
  ({ position: { x: left, y: top } }) as unknown as Enemy;

describe('computeEnemyBox', () => {
  it('should pull the box in from the corner of the enemy when the enemy stands somewhere', () => {
    const box = computeEnemyBox(createEnemyAt(ENEMY_LEFT, ENEMY_TOP));

    expect(box).toEqual({
      x: ENEMY_LEFT + ENEMY_HITBOX_INSET,
      y: ENEMY_TOP + ENEMY_HITBOX_INSET,
      width: ENEMY_WIDTH - 2 * ENEMY_HITBOX_INSET,
      height: ENEMY_HEIGHT - 2 * ENEMY_HITBOX_INSET,
    });
  });

  it('should give the whole box when the enemy sits at the corner of the level', () => {
    const box = computeEnemyBox(createEnemyAt(0, 0));

    expect(box).toEqual({
      x: ENEMY_HITBOX_INSET,
      y: ENEMY_HITBOX_INSET,
      width: ENEMY_WIDTH - 2 * ENEMY_HITBOX_INSET,
      height: ENEMY_HEIGHT - 2 * ENEMY_HITBOX_INSET,
    });
  });

  it('should keep the same size when the enemy moves', () => {
    const box = computeEnemyBox(createEnemyAt(ENEMY_LEFT, ENEMY_TOP));
    const movedBox = computeEnemyBox(createEnemyAt(0, 0));

    expect(box.width).toBe(movedBox.width);
    expect(box.height).toBe(movedBox.height);
  });
});
