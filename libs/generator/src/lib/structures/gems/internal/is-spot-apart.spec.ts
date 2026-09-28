import { describe, expect, it } from 'vitest';

import { GEM_GAP } from '../../../consts';
import { isSpotApart } from './is-spot-apart';

describe('isSpotApart', () => {
  it('should be apart when no gem is picked yet', () => {
    expect(isSpotApart([], { row: 5, column: 3 })).toBe(true);
  });

  it('should be apart when a picked gem is the gap away in the same column', () => {
    expect(
      isSpotApart([{ row: 5 + GEM_GAP, column: 3 }], { row: 5, column: 3 }),
    ).toBe(true);
  });

  it('should be apart when a picked gem is the gap away on the same row', () => {
    expect(
      isSpotApart([{ row: 5, column: 3 - GEM_GAP }], { row: 5, column: 3 }),
    ).toBe(true);
  });

  it('should be apart when a picked gem is in the next column but the gap away in rows', () => {
    expect(
      isSpotApart([{ row: 5 + GEM_GAP, column: 4 }], { row: 5, column: 3 }),
    ).toBe(true);
  });

  it('should not be apart when a picked gem is right beside it', () => {
    expect(isSpotApart([{ row: 5, column: 4 }], { row: 5, column: 3 })).toBe(
      false,
    );
  });

  it('should not be apart when a picked gem is right above it', () => {
    expect(isSpotApart([{ row: 4, column: 3 }], { row: 5, column: 3 })).toBe(
      false,
    );
  });

  it('should not be apart when a picked gem touches it at a corner', () => {
    expect(isSpotApart([{ row: 6, column: 4 }], { row: 5, column: 3 })).toBe(
      false,
    );
  });

  it('should not be apart when only one of the picked gems touches it', () => {
    expect(
      isSpotApart(
        [
          { row: 0, column: 0 },
          { row: 6, column: 2 },
        ],
        { row: 5, column: 3 },
      ),
    ).toBe(false);
  });
});
