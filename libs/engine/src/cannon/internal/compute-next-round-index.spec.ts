import { type Cannon, TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeNextRoundIndex } from './compute-next-round-index';

const CANNON_LEFT = 10 * TILE_SIZE;
const CANNON_TOP = 2 * TILE_SIZE;
const LAST_TRIPLE_ROUND_INDEX = 2;

const createCannon = (kind: Cannon['kind'], roundIndex: number): Cannon => ({
  kind,
  barrelAngle: 0,
  roundIndex,
  position: { x: CANNON_LEFT, y: CANNON_TOP },
  timers: { reload: 0 },
  statuses: { isFacingRight: true },
});

describe('computeNextRoundIndex', () => {
  it('should stay on the only round when the cannon is a regular one', () => {
    const index = computeNextRoundIndex(createCannon('REGULAR', 0));

    expect(index).toBe(0);
  });

  it('should step on to the next round when a triple cannon has rounds left', () => {
    const index = computeNextRoundIndex(createCannon('TRIPLE', 0));

    expect(index).toBe(1);
  });

  it('should wrap back to the first round when a triple cannon fires its last', () => {
    const index = computeNextRoundIndex(
      createCannon('TRIPLE', LAST_TRIPLE_ROUND_INDEX),
    );

    expect(index).toBe(0);
  });

  it('should not change the cannon it was given when it works out the round', () => {
    const cannon = createCannon('TRIPLE', 0);

    computeNextRoundIndex(cannon);

    expect(cannon).toEqual(createCannon('TRIPLE', 0));
  });
});
