import { describe, expect, it } from 'vitest';

import { computeFootingRow } from './compute-footing-row';
import { createStandingPlayer } from './create-standing-player';

const COLUMN_X = 40;

const ON_TILE_Y = 16;

const JUST_PAST_THE_EDGE_Y = 20;

const NEAR_THE_NEXT_EDGE_Y = 40;

describe('computeFootingRow', () => {
  it('should give the row under the feet when the player stands on a tile', () => {
    const player = createStandingPlayer(COLUMN_X, ON_TILE_Y);

    const row = computeFootingRow(player);

    expect(row).toBe(2);
  });

  it('should round down to the nearer row when the feet are just past a tile edge', () => {
    const player = createStandingPlayer(COLUMN_X, JUST_PAST_THE_EDGE_Y);

    const row = computeFootingRow(player);

    expect(row).toBe(2);
  });

  it('should round up to the nearer row when the feet are close to the next tile edge', () => {
    const player = createStandingPlayer(COLUMN_X, NEAR_THE_NEXT_EDGE_Y);

    const row = computeFootingRow(player);

    expect(row).toBe(3);
  });
});
