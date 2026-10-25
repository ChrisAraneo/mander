import { describe, expect, it } from 'vitest';

import { parseStructures } from './parse-structures.ts';

const TEXT = `[
  [__, DR],
]`;

describe('parseStructures', () => {
  it('should give each structure with its name and text when the file declares several', () => {
    expect(
      parseStructures(
        `import { DR, __ } from './consts';\n\nexport const NORMAL_001: Structure = ${TEXT};\n\nexport const VERTICAL_002: VerticalStructure = ${TEXT};\n`,
      ),
    ).toEqual([
      { name: 'NORMAL_001', text: TEXT },
      { name: 'VERTICAL_002', text: TEXT },
    ]);
  });

  it('should keep the windows line endings in the text when the file uses them', () => {
    expect(
      parseStructures(
        'export const HARD_001: Structure = [\r\n  [__],\r\n];\r\n',
      ),
    ).toEqual([{ name: 'HARD_001', text: '[\r\n  [__],\r\n]' }]);
  });

  it('should give no structures when the file declares none', () => {
    expect(parseStructures('const nothing = 1;\n')).toEqual([]);
  });
});
