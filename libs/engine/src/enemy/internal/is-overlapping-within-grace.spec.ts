import { describe, expect, it } from 'vitest';

import type { Hitbox } from '../../collision/types/hitbox';
import { isOverlappingWithinGrace } from './is-overlapping-within-grace';

const ENEMY_LEFT = 100;
const ENEMY_RIGHT = 122;
const ENEMY_TOP = 74;
const ENEMY_BOTTOM = 96;
const PLAYER_BOX_WIDTH = 10;
const PLAYER_TOP = 30;
const PLAYER_BOTTOM = 60;
const ABOVE_ENEMY_LEFT = 105;
const WITHIN_GRACE_RIGHT_LEFT = 125;
const WITHIN_GRACE_LEFT_LEFT = 87;
const AT_GRACE_RIGHT_LEFT = 126;
const AT_GRACE_LEFT_LEFT = 86;

const ENEMY_HITBOX: Hitbox = {
  left: ENEMY_LEFT,
  right: ENEMY_RIGHT,
  top: ENEMY_TOP,
  bottom: ENEMY_BOTTOM,
};

const createPlayerHitbox = (left: number): Hitbox => ({
  left,
  right: left + PLAYER_BOX_WIDTH,
  top: PLAYER_TOP,
  bottom: PLAYER_BOTTOM,
});

describe('isOverlappingWithinGrace', () => {
  it('should say yes when the player is right above the enemy', () => {
    expect(
      isOverlappingWithinGrace(
        createPlayerHitbox(ABOVE_ENEMY_LEFT),
        ENEMY_HITBOX,
      ),
    ).toBe(true);
  });

  it('should say yes when the player is just past the right side of the enemy but within the grace', () => {
    expect(
      isOverlappingWithinGrace(
        createPlayerHitbox(WITHIN_GRACE_RIGHT_LEFT),
        ENEMY_HITBOX,
      ),
    ).toBe(true);
  });

  it('should say yes when the player is just past the left side of the enemy but within the grace', () => {
    expect(
      isOverlappingWithinGrace(
        createPlayerHitbox(WITHIN_GRACE_LEFT_LEFT),
        ENEMY_HITBOX,
      ),
    ).toBe(true);
  });

  it('should say no when the player is at the edge of the grace on the right of the enemy', () => {
    expect(
      isOverlappingWithinGrace(
        createPlayerHitbox(AT_GRACE_RIGHT_LEFT),
        ENEMY_HITBOX,
      ),
    ).toBe(false);
  });

  it('should say no when the player is at the edge of the grace on the left of the enemy', () => {
    expect(
      isOverlappingWithinGrace(
        createPlayerHitbox(AT_GRACE_LEFT_LEFT),
        ENEMY_HITBOX,
      ),
    ).toBe(false);
  });

  it('should say yes when both hitboxes are empty and in the same place', () => {
    const emptyHitbox: Hitbox = { left: 0, right: 0, top: 0, bottom: 0 };

    expect(isOverlappingWithinGrace(emptyHitbox, emptyHitbox)).toBe(true);
  });
});
