import { map, range, without } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_HARD_LEVEL, VERTICAL_LEVELS } from '../../../consts';
import { getLevelCategory } from './get-level-category';

describe('getLevelCategory', () => {
  it('should give the vertical category when the level is one of the vertical levels', () => {
    expect(map(VERTICAL_LEVELS, getLevelCategory)).toEqual(
      map(VERTICAL_LEVELS, () => 'VERTICAL'),
    );
  });

  it('should give the hard category when the level is the first hard level or later', () => {
    expect(getLevelCategory(FIRST_HARD_LEVEL)).toBe('HARD');
    expect(getLevelCategory(FIRST_HARD_LEVEL + 1)).toBe('HARD');
  });

  it('should give the normal category when the level comes before the first hard level', () => {
    const early = without(range(1, FIRST_HARD_LEVEL), ...VERTICAL_LEVELS);

    expect(map(early, getLevelCategory)).toEqual(map(early, () => 'NORMAL'));
  });
});
