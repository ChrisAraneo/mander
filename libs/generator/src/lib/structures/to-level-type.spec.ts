import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY, VERTICAL_LEVELS } from '../consts';
import { toLevelType } from './to-level-type';

const LEVEL_NUMBERS = range(1, LEVELS_PER_DAY + 1);

describe('toLevelType', () => {
  it('should say vertical when the level is one of the vertical levels', () => {
    expect(map(VERTICAL_LEVELS, toLevelType)).toEqual(
      map(VERTICAL_LEVELS, () => 'VERTICAL'),
    );
  });

  it('should say horizontal when the level is the first of the day', () => {
    expect(toLevelType(1)).toBe('HORIZONTAL');
  });

  it('should say horizontal when the level is any other of the day', () => {
    expect(map(LEVEL_NUMBERS, toLevelType)).toEqual([
      'HORIZONTAL',
      'VERTICAL',
      'HORIZONTAL',
      'HORIZONTAL',
      'VERTICAL',
      'HORIZONTAL',
      'HORIZONTAL',
      'HORIZONTAL',
    ]);
  });
});
