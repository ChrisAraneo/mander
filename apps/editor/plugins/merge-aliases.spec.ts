import { describe, expect, it } from 'vitest';

import { mergeAliases } from './merge-aliases';

const source = `import { DR, __ } from './consts';
import type { Structure } from './structure';
`;

describe('mergeAliases', () => {
  it('should import the aliases the new structure leans on', () => {
    expect(mergeAliases(source, '[\n  [CN, SS],\n]')).toBe(
      `import { DR, __, CN, SS } from './consts';
import type { Structure } from './structure';
`,
    );
  });

  it('should leave the import alone when everything is already there', () => {
    expect(mergeAliases(source, '[\n  [DR, __],\n]')).toBe(source);
  });

  it('should keep a multi-line import list multi-line', () => {
    const listed = `import {
  DR,
  __,
} from './consts';
`;

    expect(mergeAliases(listed, '[\n  [CN],\n]')).toBe(
      `import {
  DR,
  __,
  CN,
} from './consts';
`,
    );
  });

  it('should leave a file with no alias import untouched', () => {
    expect(mergeAliases('const nothing = 1;\n', '[\n  [CN],\n]')).toBe(
      'const nothing = 1;\n',
    );
  });
});
