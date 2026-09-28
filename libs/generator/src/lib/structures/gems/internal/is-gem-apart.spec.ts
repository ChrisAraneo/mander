import { describe, expect, it } from 'vitest';

import { GEM_GAP } from '../../../consts';
import { isGemApart } from './is-gem-apart';

describe('isGemApart', () => {
  it('should be apart in a horizontal level when no gem is picked yet', () => {
    expect(isGemApart('HORIZONTAL', [], { row: 5, column: 3 })).toBe(true);
  });

  it('should be apart in a vertical level when no gem is picked yet', () => {
    expect(isGemApart('VERTICAL', [], { row: 5, column: 3 })).toBe(true);
  });

  it('should be apart in a horizontal level when a picked gem is the gap away in columns', () => {
    expect(
      isGemApart('HORIZONTAL', [{ row: 5, column: 3 + GEM_GAP }], {
        row: 5,
        column: 3,
      }),
    ).toBe(true);
  });

  it('should not be apart in a horizontal level when a picked gem is in the next column but the gap away in rows', () => {
    expect(
      isGemApart('HORIZONTAL', [{ row: 5 + GEM_GAP, column: 4 }], {
        row: 5,
        column: 3,
      }),
    ).toBe(false);
  });

  it('should be apart in a vertical level when a picked gem is in the next column but the gap away in rows', () => {
    expect(
      isGemApart('VERTICAL', [{ row: 5 + GEM_GAP, column: 4 }], {
        row: 5,
        column: 3,
      }),
    ).toBe(true);
  });

  it('should not be apart in a vertical level when a picked gem touches it', () => {
    expect(
      isGemApart('VERTICAL', [{ row: 6, column: 4 }], { row: 5, column: 3 }),
    ).toBe(false);
  });
});
