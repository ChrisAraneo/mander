import { describe, expect, it } from 'vitest';

import { formatStructureDeclaration } from './format-structure-declaration.ts';

describe('formatStructureDeclaration', () => {
  it('should write the structure as an exported constant of its type when it is given a grid', () => {
    expect(
      formatStructureDeclaration('VERTICAL_001', 'VerticalStructure', '[]'),
    ).toBe('export const VERTICAL_001: VerticalStructure = [];');
  });

  it('should write an empty value when the grid text is empty', () => {
    expect(formatStructureDeclaration('NORMAL_001', 'Structure', '')).toBe(
      'export const NORMAL_001: Structure = ;',
    );
  });
});
