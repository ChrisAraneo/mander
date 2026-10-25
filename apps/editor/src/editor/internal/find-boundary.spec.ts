import { describe, expect, it } from 'vitest';

import { findBoundary } from './find-boundary';

describe('findBoundary', () => {
  it('should give where the first layer closes when the text has a closed layer', () => {
    expect(findBoundary('[\n  [\n    [__],\n  ],\n  [],\n]')).toBe(16);
  });

  it('should give the end of the text when no layer closes in it', () => {
    expect(findBoundary('[\n  [],\n  [],\n]')).toBe(15);
  });

  it('should give zero when the text is empty', () => {
    expect(findBoundary('')).toBe(0);
  });
});
