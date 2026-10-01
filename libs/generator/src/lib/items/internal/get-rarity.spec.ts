import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { getRarity } from './get-rarity';

describe('getRarity', () => {
  it('should give common when the roll is below the common chance', () => {
    expect(map([0, 0.5, 0.78], getRarity)).toEqual([
      'COMMON',
      'COMMON',
      'COMMON',
    ]);
  });

  it('should give rare when the roll lands between the common and the rare chance', () => {
    expect(map([0.79, 0.9, 0.97], getRarity)).toEqual(['RARE', 'RARE', 'RARE']);
  });

  it('should give epic when the roll lands past the rare chance', () => {
    expect(map([0.99, 0.999], getRarity)).toEqual(['EPIC', 'EPIC']);
  });
});
