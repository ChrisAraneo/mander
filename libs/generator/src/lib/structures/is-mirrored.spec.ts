import { filter, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { MIRRORED_LEVELS } from '../consts';
import { isMirrored } from './is-mirrored';

const LEVELS_A_DAY = 8;

const levelNumbers = times(LEVELS_A_DAY, (index) => index + 1);

describe('isMirrored', () => {
  it('should turn the third and the sixth level around', () => {
    expect(MIRRORED_LEVELS).toEqual([3, 6]);
    expect(isMirrored(3)).toBe(true);
    expect(isMirrored(6)).toBe(true);
  });

  it('should leave every other level of the day running the way it was built', () => {
    expect(filter(levelNumbers, isMirrored)).toEqual([3, 6]);
  });

  it('should never turn the level the player starts the day on', () => {
    expect(isMirrored(1)).toBe(false);
  });

  it('should answer the same for a level number whatever the day', () => {
    expect(map(levelNumbers, isMirrored)).toEqual(
      map(levelNumbers, isMirrored),
    );
  });
});
