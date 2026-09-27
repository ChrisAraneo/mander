import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { VERTICAL_LEVELS } from '../consts';
import { getLevelType } from './get-level-type';

const LEVELS_A_DAY = 8;

const levelNumbers = times(LEVELS_A_DAY, (index) => index + 1);

describe('getLevelType', () => {
  it('should say vertical when the level is one of the vertical levels', () => {
    expect(map(VERTICAL_LEVELS, getLevelType)).toEqual(
      map(VERTICAL_LEVELS, () => 'VERTICAL'),
    );
  });

  it('should say horizontal when the level is the first of the day', () => {
    expect(getLevelType(1)).toBe('HORIZONTAL');
  });

  it('should say horizontal for every other level of the day', () => {
    expect(map(levelNumbers, getLevelType)).toEqual([
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
