import { describe, expect, it } from 'vitest';

import { sharpen } from './sharpen';

describe('sharpen', () => {
  it('should turn a cell to one when it is half or more', () => {
    expect(sharpen([[0.5, 0.8, 1]])).toEqual([[1, 1, 1]]);
  });

  it('should turn a cell to zero when it is under half', () => {
    expect(sharpen([[0, 0.2, 0.49]])).toEqual([[0, 0, 0]]);
  });

  it('should sharpen every row', () => {
    expect(sharpen([[0.3], [0.7]])).toEqual([[0], [1]]);
  });
});
