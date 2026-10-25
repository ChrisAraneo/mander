import { describe, expect, it } from 'vitest';

import type { Hitbox } from '../../types/hitbox';
import { isOverlappingWithinGrace } from './is-overlapping-within-grace';

const ENEMY_HITBOX: Hitbox = { left: 100, right: 122, top: 74, bottom: 96 };

const createPlayerHitbox = (left: number): Hitbox => ({
  left,
  right: left + 10,
  top: 30,
  bottom: 60,
});

describe('isOverlappingWithinGrace', () => {
  it('should say yes when the player is right above the enemy', () => {
    expect(
      isOverlappingWithinGrace(createPlayerHitbox(105), ENEMY_HITBOX),
    ).toBe(true);
  });

  it('should say yes when the player is just past the right side of the enemy but within the grace', () => {
    expect(
      isOverlappingWithinGrace(createPlayerHitbox(125), ENEMY_HITBOX),
    ).toBe(true);
  });

  it('should say yes when the player is just past the left side of the enemy but within the grace', () => {
    expect(isOverlappingWithinGrace(createPlayerHitbox(87), ENEMY_HITBOX)).toBe(
      true,
    );
  });

  it('should say no when the player is at the edge of the grace on the right of the enemy', () => {
    expect(
      isOverlappingWithinGrace(createPlayerHitbox(126), ENEMY_HITBOX),
    ).toBe(false);
  });

  it('should say no when the player is at the edge of the grace on the left of the enemy', () => {
    expect(isOverlappingWithinGrace(createPlayerHitbox(86), ENEMY_HITBOX)).toBe(
      false,
    );
  });

  it('should say yes when both hitboxes are empty and in the same place', () => {
    const emptyHitbox: Hitbox = { left: 0, right: 0, top: 0, bottom: 0 };

    expect(isOverlappingWithinGrace(emptyHitbox, emptyHitbox)).toBe(true);
  });
});
