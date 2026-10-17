import { describe, expect, it } from 'vitest';

import { createStandingPlayer } from './create-standing-player';
import { hashPlayerNode } from './hash-player-node';

describe('hashPlayerNode', () => {
  it('should combine the rounded column and row of the player into one key when the player stands away from the origin', () => {
    const player = createStandingPlayer(100, 50);

    const key = hashPlayerNode(player);

    expect(key).toBe(3074);
  });

  it('should give zero when the player stands at the origin', () => {
    const player = createStandingPlayer(0, 0);

    const key = hashPlayerNode(player);

    expect(key).toBe(0);
  });
});
