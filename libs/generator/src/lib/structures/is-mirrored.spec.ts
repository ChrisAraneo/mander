import { filter, map, size, times, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isMirrored, MIRROR_CHANCE } from './is-mirrored';

const seeds = times(600, (index) => `SEED-${index}`);

const share = (): number => size(filter(seeds, isMirrored)) / size(seeds);

describe('isMirrored', () => {
  it('should turn about three levels in ten around', () => {
    expect(MIRROR_CHANCE).toBe(0.3);
    expect(share()).toBeCloseTo(MIRROR_CHANCE, 1);
  });

  it('should leave most levels running the way they were built', () => {
    expect(share()).toBeLessThan(0.5);
  });

  it('should call the same seed the same way every time', () => {
    expect(map(seeds, isMirrored)).toEqual(map(seeds, isMirrored));
  });

  it('should not answer the same for every seed', () => {
    expect(uniq(map(seeds, isMirrored)).sort()).toEqual([false, true]);
  });
});
