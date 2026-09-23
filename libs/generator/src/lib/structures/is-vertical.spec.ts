import { filter, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { VERTICAL_LEVELS } from '../consts';
import { isMirrored } from './is-mirrored';
import { isVertical } from './is-vertical';

const LEVELS_A_DAY = 8;

const levelNumbers = times(LEVELS_A_DAY, (index) => index + 1);

describe('isVertical', () => {
  it('should send the player up when the level is the second or the fifth', () => {
    expect(VERTICAL_LEVELS).toEqual([2, 5]);
    expect(isVertical(2)).toBe(true);
    expect(isVertical(5)).toBe(true);
  });

  it('should leave the level running sideways when it is any other of the day', () => {
    expect(filter(levelNumbers, isVertical)).toEqual([2, 5]);
  });

  it('should never stand the level up when it is the one the player starts the day on', () => {
    expect(isVertical(1)).toBe(false);
  });

  it('should never turn the level around as well when it stands it up', () => {
    expect(
      filter(levelNumbers, (level) => isVertical(level) && isMirrored(level)),
    ).toEqual([]);
  });

  it('should answer the same for a level number when the day it falls on changes', () => {
    expect(map(levelNumbers, isVertical)).toEqual(
      map(levelNumbers, isVertical),
    );
  });
});
