import { describe, expect, it } from 'vitest';

import { GEM_GAP } from '../../../consts';
import { isColumnApart } from './is-column-apart';

describe('isColumnApart', () => {
  it('should be apart when no gem is picked yet', () => {
    expect(isColumnApart([], { row: 5, column: 3 })).toBe(true);
  });

  it('should be apart when every picked gem is the gap away or more', () => {
    expect(
      isColumnApart(
        [
          { row: 5, column: 3 - GEM_GAP },
          { row: 5, column: 3 + GEM_GAP + 1 },
        ],
        { row: 5, column: 3 },
      ),
    ).toBe(true);
  });

  it('should not be apart when a picked gem is in the next column', () => {
    expect(isColumnApart([{ row: 5, column: 4 }], { row: 5, column: 3 })).toBe(
      false,
    );
  });

  it('should not be apart when a picked gem is in the same column', () => {
    expect(isColumnApart([{ row: 1, column: 3 }], { row: 5, column: 3 })).toBe(
      false,
    );
  });

  it('should not be apart when a picked gem is in the next column but stands far higher', () => {
    expect(isColumnApart([{ row: 0, column: 2 }], { row: 9, column: 3 })).toBe(
      false,
    );
  });

  it('should not be apart when only one of the picked gems is too near', () => {
    expect(
      isColumnApart(
        [
          { row: 5, column: 0 },
          { row: 5, column: 4 },
        ],
        { row: 5, column: 3 },
      ),
    ).toBe(false);
  });
});
