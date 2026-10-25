import { describe, expect, it } from 'vitest';

import { formatSavedStatus } from './format-saved-status';

describe('formatSavedStatus', () => {
  it('should say it wrote the structure when the structure is new', () => {
    expect(
      formatSavedStatus({
        name: 'NORMAL_002',
        pool: 'normal',
        isCreated: true,
      }),
    ).toBe('Wrote NORMAL_002 in normal.ts');
  });

  it('should say it updated the structure when the pool already had it', () => {
    expect(
      formatSavedStatus({
        name: 'VERTICAL_001',
        pool: 'vertical',
        isCreated: false,
      }),
    ).toBe('Updated VERTICAL_001 in vertical.ts');
  });
});
