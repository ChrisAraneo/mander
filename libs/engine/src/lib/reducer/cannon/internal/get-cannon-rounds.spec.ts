import { map, sum } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  CANNON_RELOAD_SECONDS,
  TRIPLE_CANNON_SHOT_GAP_SECONDS,
  TRIPLE_CANNON_SPREAD_RADIANS,
} from '../consts';
import { getCannonRounds } from './get-cannon-rounds';

describe('getCannonRounds', () => {
  it('should give a single level round on the normal reload when the cannon is regular', () => {
    expect(getCannonRounds('REGULAR')).toEqual([
      { angle: 0, reloadSeconds: CANNON_RELOAD_SECONDS },
    ]);
  });

  it('should aim up, then level, then down when the cannon is triple', () => {
    expect(map(getCannonRounds('TRIPLE'), (round) => round.angle)).toEqual([
      -TRIPLE_CANNON_SPREAD_RADIANS,
      0,
      TRIPLE_CANNON_SPREAD_RADIANS,
    ]);
  });

  it('should leave a short gap after the first two rounds when the cannon is triple', () => {
    const [first, second] = getCannonRounds('TRIPLE');

    expect(first.reloadSeconds).toBe(TRIPLE_CANNON_SHOT_GAP_SECONDS);
    expect(second.reloadSeconds).toBe(TRIPLE_CANNON_SHOT_GAP_SECONDS);
  });

  it('should take one and a half reloads to get through all its rounds when the cannon is triple', () => {
    expect(
      sum(map(getCannonRounds('TRIPLE'), (round) => round.reloadSeconds)),
    ).toBeCloseTo(CANNON_RELOAD_SECONDS * 1.5, 6);
  });

  it('should spread the triple rounds by twenty degrees when they leave the barrel', () => {
    expect((TRIPLE_CANNON_SPREAD_RADIANS * 180) / Math.PI).toBeCloseTo(20);
  });
});
