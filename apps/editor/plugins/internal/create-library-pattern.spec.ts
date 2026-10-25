import { describe, expect, it } from 'vitest';

import { createLibraryPattern } from './create-library-pattern.ts';

const LIBRARY = `export const HARD_LIBRARY = Object.freeze({
  HARD_001,
});

export const NORMAL_LIBRARY = Object.freeze({
  NORMAL_001,
});`;

describe('createLibraryPattern', () => {
  it('should find the names dealt into the pool when the library lists them', () => {
    const found = createLibraryPattern('normal').exec(LIBRARY);

    expect(found?.[0]).toBe(
      'export const NORMAL_LIBRARY = Object.freeze({\n  NORMAL_001,\n});',
    );
    expect(found?.[1]).toBe('\n  NORMAL_001,\n');
  });

  it('should find nothing when the library has no list for the pool', () => {
    expect(createLibraryPattern('vertical').exec(LIBRARY)).toBeNull();
  });
});
