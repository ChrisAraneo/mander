import { filter, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { VERTICAL_LEVELS } from '../consts';
import { isMirrored } from './is-mirrored';
import { isVertical } from './is-vertical';

const LEVELS_A_DAY = 8;

const levelNumbers = times(LEVELS_A_DAY, (index) => index + 1);

describe('isVertical', () => {
  it('should send the player up on the second and the fifth level', () => {
    expect(VERTICAL_LEVELS).toEqual([2, 5]);
    expect(isVertical(2)).toBe(true);
    expect(isVertical(5)).toBe(true);
  });

  it('should leave every other level of the day running sideways', () => {
    expect(filter(levelNumbers, isVertical)).toEqual([2, 5]);
  });

  it('should never stand the level the player starts the day on up', () => {
    expect(isVertical(1)).toBe(false);
  });

  it('should never turn a level it stands up around as well', () => {
    expect(
      filter(levelNumbers, (level) => isVertical(level) && isMirrored(level)),
    ).toEqual([]);
  });

  it('should answer the same for a level number whatever the day', () => {
    expect(map(levelNumbers, isVertical)).toEqual(
      map(levelNumbers, isVertical),
    );
  });
});
