import { filter, map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY, MIRRORED_LEVELS } from '../consts';
import { isMirrored } from './is-mirrored';

const LEVEL_NUMBERS = range(1, LEVELS_PER_DAY + 1);

describe('isMirrored', () => {
  it('should turn the level around when it is the third or the sixth', () => {
    expect(MIRRORED_LEVELS).toEqual([3, 6]);
    expect(isMirrored(3)).toBe(true);
    expect(isMirrored(6)).toBe(true);
  });

  it('should leave the level running the way it was built when it is any other of the day', () => {
    expect(filter(LEVEL_NUMBERS, isMirrored)).toEqual([3, 6]);
  });

  it('should never turn the level around when it is the one the player starts the day on', () => {
    expect(isMirrored(1)).toBe(false);
  });

  it('should answer the same for a level number when the day it falls on changes', () => {
    expect(map(LEVEL_NUMBERS, isMirrored)).toEqual(
      map(LEVEL_NUMBERS, isMirrored),
    );
  });
});
