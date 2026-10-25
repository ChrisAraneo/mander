import { describe, expect, it } from 'vitest';

import { createBlockPattern } from './create-block-pattern.ts';

const SOURCE = `export const NORMAL_001: Structure = [
  [],
  [],
];

export const VERTICAL_001: VerticalStructure = [
  [],
  [],
];
`;

describe('createBlockPattern', () => {
  it('should find the whole declaration of the structure when the source declares it', () => {
    expect(createBlockPattern('NORMAL_001').exec(SOURCE)?.[0]).toBe(
      'export const NORMAL_001: Structure = [\n  [],\n  [],\n];',
    );
  });

  it('should find the declaration when the structure is a vertical one', () => {
    expect(createBlockPattern('VERTICAL_001').test(SOURCE)).toBe(true);
  });

  it('should find nothing when the source does not declare the structure', () => {
    expect(createBlockPattern('NORMAL_002').test(SOURCE)).toBe(false);
  });
});
