import { map, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LEVELS_PER_DAY, VERTICAL_LEVELS } from '../consts';
import { getLevelType } from './get-level-type';

const LEVEL_NUMBERS = range(1, LEVELS_PER_DAY + 1);

describe('getLevelType', () => {
  it('should say vertical when the level is one of the vertical levels', () => {
    expect(map(VERTICAL_LEVELS, getLevelType)).toEqual(
      map(VERTICAL_LEVELS, () => 'VERTICAL'),
    );
  });

  it('should say horizontal when the level is the first of the day', () => {
    expect(getLevelType(1)).toBe('HORIZONTAL');
  });

  it('should say horizontal when the level is any other of the day', () => {
    expect(map(LEVEL_NUMBERS, getLevelType)).toEqual([
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
