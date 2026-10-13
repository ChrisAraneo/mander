import { map, range, without } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_HARD_LEVEL, VERTICAL_LEVELS } from '../../consts';
import { toLevelCategory } from './to-level-category';

describe('toLevelCategory', () => {
  it('should give the vertical category when the level is one of the vertical levels', () => {
    expect(map(VERTICAL_LEVELS, toLevelCategory)).toEqual(
      map(VERTICAL_LEVELS, () => 'VERTICAL'),
    );
  });

  it('should give the hard category when the level is the first hard level or later', () => {
    expect(toLevelCategory(FIRST_HARD_LEVEL)).toBe('HARD');
    expect(toLevelCategory(FIRST_HARD_LEVEL + 1)).toBe('HARD');
  });

  it('should give the normal category when the level comes before the first hard level', () => {
    const early = without(range(1, FIRST_HARD_LEVEL), ...VERTICAL_LEVELS);

    expect(map(early, toLevelCategory)).toEqual(map(early, () => 'NORMAL'));
  });
});
