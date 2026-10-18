import { describe, expect, it } from 'vitest';

import { getWoodPlankTones } from './get-wood-plank-tones';

describe('getWoodPlankTones', () => {
  it('should give five copies of the colour when the colour is not written as HSL', () => {
    const result = getWoodPlankTones('#96694F');

    expect(result).toEqual([
      '#96694F',
      '#96694F',
      '#96694F',
      '#96694F',
      '#96694F',
    ]);
  });

  it('should give five lighter and darker tones when the colour is written as HSL', () => {
    const result = getWoodPlankTones('HSL(26, 21%, 43%)');

    expect(result).toEqual([
      'HSL(26, 21%, 43%)',
      'HSL(26, 21%, 41%)',
      'HSL(26, 21%, 47%)',
      'HSL(26, 21%, 37%)',
      'HSL(26, 21%, 42%)',
    ]);
  });

  it('should hand back the same tones when it is asked for the same colour again', () => {
    const first = getWoodPlankTones('HSL(30, 20%, 40%)');

    const second = getWoodPlankTones('HSL(30, 20%, 40%)');

    expect(second).toBe(first);
  });
});
