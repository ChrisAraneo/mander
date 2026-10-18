import { describe, expect, it } from 'vitest';

import { BLUE_GEM_COLORS } from '../../gem-shape/consts';
import { createGemArt } from './create-gem-art';

describe('createGemArt', () => {
  it('should make gem art in the given colours when it is given gem colours', () => {
    const result = createGemArt(BLUE_GEM_COLORS);

    expect(result).toEqual({ kind: 'GEM', colors: BLUE_GEM_COLORS });
  });
});
