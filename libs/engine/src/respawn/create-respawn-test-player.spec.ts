import { describe, expect, it } from 'vitest';

import { createRespawnTestPlayer } from './create-respawn-test-player';

const CARRIED_HEARTS = 1;

describe('createRespawnTestPlayer', () => {
  it('should give the player the hearts they carry when it builds the player', () => {
    expect(createRespawnTestPlayer().hearts).toEqual({
      value: CARRIED_HEARTS,
    });
  });

  it('should stand the player at the spawn of the level when it builds the player', () => {
    expect(createRespawnTestPlayer().position.x).toBeGreaterThan(0);
    expect(createRespawnTestPlayer().statuses.isFacingRight).toBe(true);
  });

  it('should build a player of its own each time it is called', () => {
    expect(createRespawnTestPlayer()).not.toBe(createRespawnTestPlayer());
    expect(createRespawnTestPlayer()).toEqual(createRespawnTestPlayer());
  });
});
