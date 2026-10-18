import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toRarity } from './to-rarity';

describe('toRarity', () => {
  it('should give common when the roll is below the common chance', () => {
    expect(map([0, 0.5, 0.78], toRarity)).toEqual([
      'COMMON',
      'COMMON',
      'COMMON',
    ]);
  });

  it('should give rare when the roll lands at or past the common chance', () => {
    expect(map([0.79, 0.9, 0.97, 0.99, 0.999], toRarity)).toEqual([
      'RARE',
      'RARE',
      'RARE',
      'RARE',
      'RARE',
    ]);
  });
});
