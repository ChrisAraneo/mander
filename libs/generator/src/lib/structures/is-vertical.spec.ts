import { filter, map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY, VERTICAL_LEVELS } from '../consts';
import { isMirrored } from './is-mirrored';
import { isVertical } from './is-vertical';

const LEVEL_NUMBERS = range(1, LEVELS_PER_DAY + 1);

describe('isVertical', () => {
  it('should send the player up when the level is the second or the fifth', () => {
    expect(VERTICAL_LEVELS).toEqual([2, 5]);
    expect(isVertical(2)).toBe(true);
    expect(isVertical(5)).toBe(true);
  });

  it('should leave the level running sideways when it is any other of the day', () => {
    expect(filter(LEVEL_NUMBERS, isVertical)).toEqual([2, 5]);
  });

  it('should never stand the level up when it is the one the player starts the day on', () => {
    expect(isVertical(1)).toBe(false);
  });

  it('should never turn the level around as well when it stands it up', () => {
    expect(
      filter(
        LEVEL_NUMBERS,
        (levelNumber) => isVertical(levelNumber) && isMirrored(levelNumber),
      ),
    ).toEqual([]);
  });

  it('should answer the same for a level number when the day it falls on changes', () => {
    expect(map(LEVEL_NUMBERS, isVertical)).toEqual(
      map(LEVEL_NUMBERS, isVertical),
    );
  });
});
