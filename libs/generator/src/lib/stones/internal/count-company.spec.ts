import { describe, expect, it } from 'vitest';

import { countCompany } from './count-company';

const BLOBS = [
  [1, 1, 0],
  [1, 1, 1],
  [0, 0, 1],
];

describe('countCompany', () => {
  it('should count the stones above, below, left and right when it looks around a cell', () => {
    expect(countCompany(BLOBS, 1, 1)).toBe(3);
  });

  it('should count nothing when the stones only touch at a corner', () => {
    expect(
      countCompany(
        [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1],
        ],
        1,
        1,
      ),
    ).toBe(0);
  });

  it('should count nothing past the edge when the cell sits at the edge of the field', () => {
    expect(countCompany(BLOBS, 0, 0)).toBe(2);
    expect(countCompany(BLOBS, 2, 2)).toBe(1);
  });
});
