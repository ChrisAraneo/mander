import { describe, expect, it } from 'vitest';

import { isStructureText } from './is-structure-text.ts';

describe('isStructureText', () => {
  it('should accept the grid the editor writes', () => {
    expect(isStructureText('[\n  [__, DR],\n  [DR, DR],\n]')).toBe(true);
  });

  it('should turn away rows of uneven length', () => {
    expect(isStructureText('[\n  [__, DR],\n  [DR],\n]')).toBe(false);
  });

  it('should turn away anything that is not a grid of tokens', () => {
    expect(isStructureText('[\n  [__, DR];\n]')).toBe(false);
    expect(isStructureText('[]')).toBe(false);
    expect(isStructureText('')).toBe(false);
  });

  it('should turn away smuggled code', () => {
    expect(
      isStructureText(
        '[\n  [__, DR],\n];\nprocess.exit(1);\nconst x = [\n  [DR],\n]',
      ),
    ).toBe(false);
    expect(isStructureText('[\n  [__, DR()],\n]')).toBe(false);
  });
});
