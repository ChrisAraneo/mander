import { describe, expect, it } from 'vitest';

import { addDeclaration } from './add-declaration.ts';

describe('addDeclaration', () => {
  it('should add the declaration after one blank line when the source ends with several', () => {
    expect(addDeclaration('const A = 1;\n\n\n', 'const B = 2;')).toBe(
      'const A = 1;\n\nconst B = 2;\n',
    );
  });

  it('should still put a blank line in front when the source is empty', () => {
    expect(addDeclaration('', 'const B = 2;')).toBe('\n\nconst B = 2;\n');
  });
});
