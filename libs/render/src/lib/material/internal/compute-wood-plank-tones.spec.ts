import { describe, expect, it } from 'vitest';

import { computeWoodPlankTones } from './compute-wood-plank-tones';

describe('computeWoodPlankTones', () => {
  it('should give five copies of the colour when the colour is not written as HSL', () => {
    const result = computeWoodPlankTones('#96694F');

    expect(result).toEqual([
      '#96694F',
      '#96694F',
      '#96694F',
      '#96694F',
      '#96694F',
    ]);
  });

  it('should give five copies of the empty colour when the colour is empty', () => {
    const result = computeWoodPlankTones('');

    expect(result).toEqual(['', '', '', '', '']);
  });

  it('should shift the lightness of each plank when the colour is written as HSL', () => {
    const result = computeWoodPlankTones('HSL(26, 21%, 43%)');

    expect(result).toEqual([
      'HSL(26, 21%, 43%)',
      'HSL(26, 21%, 41%)',
      'HSL(26, 21%, 47%)',
      'HSL(26, 21%, 37%)',
      'HSL(26, 21%, 42%)',
    ]);
  });
});
