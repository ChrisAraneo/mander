import { describe, expect, it } from 'vitest';

import { SPIKE_PRONGS } from '../consts';
import { toProngCount } from './to-prong-count';

describe('toProngCount', () => {
  it('should give one prong when the spike is single', () => {
    expect(toProngCount('SINGLE')).toBe(1);
  });

  it('should give every prong of a strip when the spike is a strip', () => {
    expect(toProngCount('STRIP')).toBe(SPIKE_PRONGS);
  });
});
