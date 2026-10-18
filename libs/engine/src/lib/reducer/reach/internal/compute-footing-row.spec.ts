import { describe, expect, it } from 'vitest';

import { computeFootingRow } from './compute-footing-row';
import { createStandingPlayer } from './create-standing-player';

describe('computeFootingRow', () => {
  it('should give the row under the feet when the player stands on a tile', () => {
    const player = createStandingPlayer(40, 16);

    const row = computeFootingRow(player);

    expect(row).toBe(2);
  });

  it('should round down to the nearer row when the feet are just past a tile edge', () => {
    const player = createStandingPlayer(40, 20);

    const row = computeFootingRow(player);

    expect(row).toBe(2);
  });

  it('should round up to the nearer row when the feet are close to the next tile edge', () => {
    const player = createStandingPlayer(40, 40);

    const row = computeFootingRow(player);

    expect(row).toBe(3);
  });
});
