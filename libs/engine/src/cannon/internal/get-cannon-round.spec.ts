import type { Cannon } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getCannonRound } from './get-cannon-round';
import { getCannonRounds } from './get-cannon-rounds';

const createCannon = (roundIndex: number): Cannon => ({
  kind: 'TRIPLE',
  barrelAngle: 0,
  roundIndex,
  position: { x: 320, y: 64 },
  timers: { reload: 1 },
  statuses: { isFacingRight: true },
});

describe('getCannonRound', () => {
  it('should give the first round when the cannon has not fired yet', () => {
    expect(getCannonRound(createCannon(0))).toBe(getCannonRounds('TRIPLE')[0]);
  });

  it('should give the round the cannon has reached when it is part way through', () => {
    expect(getCannonRound(createCannon(2))).toBe(getCannonRounds('TRIPLE')[2]);
  });
});
