import { endsWith, includes } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { parseStructures } from './parse-structures.ts';
import { patchStructure } from './patch-structure.ts';

const TEXT = `[
  [__, DR],
  [DR, DR],
]`;

const OTHER = `[
  [DR, __],
  [DR, DR],
]`;

const source = `import { DR, __ } from './consts';
import type { Structure } from './structure';

export const NORMAL_001: Structure = ${TEXT};

export const NORMAL_002: Structure = ${OTHER};
`;

describe('patchStructure', () => {
  it('should rewrite the structure when it is already there', () => {
    const { source: written, isCreated } = patchStructure(
      source,
      'NORMAL_001',
      OTHER,
    );

    expect(isCreated).toBe(false);
    expect(parseStructures(written)).toEqual([
      { name: 'NORMAL_001', text: OTHER },
      { name: 'NORMAL_002', text: OTHER },
    ]);
  });

  it('should leave its neighbours untouched when it rewrites one', () => {
    const { source: written } = patchStructure(source, 'NORMAL_002', TEXT);

    expect(written).toBe(
      `import { DR, __ } from './consts';
import type { Structure } from './structure';

export const NORMAL_001: Structure = ${TEXT};

export const NORMAL_002: Structure = ${TEXT};
`,
    );
  });

  it('should add the structure after the last one when the file has never seen it', () => {
    const { source: written, isCreated } = patchStructure(
      source,
      'NORMAL_003',
      TEXT,
    );

    expect(isCreated).toBe(true);
    expect(
      endsWith(written, `export const NORMAL_003: Structure = ${TEXT};\n`),
    ).toBe(true);
    expect(parseStructures(written)).toHaveLength(3);
  });

  it('should keep one blank line between the structures when it adds a second one', () => {
    const once = patchStructure(source, 'NORMAL_003', TEXT).source;
    const twice = patchStructure(once, 'NORMAL_004', TEXT).source;

    expect(includes(twice, '\n\n\n')).toBe(false);
    expect(parseStructures(twice)).toHaveLength(4);
  });
});
