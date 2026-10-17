import { describe, expect, it } from 'vitest';

import type { Hitbox } from '../types/hitbox';
import { isOverlappingHitbox } from './is-overlapping-hitbox';

const PLAYER_HITBOX: Hitbox = { left: 0, right: 10, top: 0, bottom: 10 };

const OVERLAPPING_HITBOX: Hitbox = { left: 5, right: 15, top: 5, bottom: 15 };

const DISTANT_HITBOX: Hitbox = { left: 50, right: 60, top: 50, bottom: 60 };

const TOUCHING_HITBOX: Hitbox = { left: 10, right: 20, top: 0, bottom: 10 };

describe('isOverlappingHitbox', () => {
  it('should be true when the player and the enemy overlap', () => {
    const isOverlapping = isOverlappingHitbox(
      PLAYER_HITBOX,
      OVERLAPPING_HITBOX,
    );

    expect(isOverlapping).toBe(true);
  });

  it('should be false when the player and the enemy are far apart', () => {
    const isOverlapping = isOverlappingHitbox(PLAYER_HITBOX, DISTANT_HITBOX);

    expect(isOverlapping).toBe(false);
  });

  it('should be false when the player and the enemy only touch edge to edge', () => {
    const isOverlapping = isOverlappingHitbox(PLAYER_HITBOX, TOUCHING_HITBOX);

    expect(isOverlapping).toBe(false);
  });

  it('should give the same answer when the player and the enemy are swapped', () => {
    const isOverlapping = isOverlappingHitbox(
      OVERLAPPING_HITBOX,
      PLAYER_HITBOX,
    );

    const isDistant = isOverlappingHitbox(DISTANT_HITBOX, PLAYER_HITBOX);

    const isTouching = isOverlappingHitbox(TOUCHING_HITBOX, PLAYER_HITBOX);

    expect(isOverlapping).toBe(true);
    expect(isDistant).toBe(false);
    expect(isTouching).toBe(false);
  });
});
